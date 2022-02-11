import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as basicFtp from 'basic-ftp';
import * as _ from 'lodash';
import { map, pick } from 'lodash';
import { CustomerAddress } from 'src/modules/entity/address.entity';
import { Customer } from 'src/modules/entity/customer.entity';
import { Pagination } from 'src/shared/class';
import { bindDataTableQuery } from 'src/shared/helpers/utill';
import {
  ContractService,
  SupplierPincodeService,
  SupplierService,
  UserService,
} from 'src/shared/services';
import { CustomerAddressService } from 'src/shared/services/address/address.service';
import * as streamBuffers from 'stream-buffers';
import * as turf from 'turf-inside';
import * as point from 'turf-point';
import * as poly from 'turf-polygon';
import { Not, Repository } from 'typeorm';
import { parseString } from 'xml2js';
import { Contract } from '../../../modules/entity/contract.entity';
import { Polygon } from '../../../modules/entity/polygon.entity';
import { PolygonSites } from '../../../modules/entity/polygon_sites.entity';
import { Route } from '../../../modules/entity/route.entity';
import { RouteProgress } from '../../../modules/entity/route_progress.entity';
import { RouteSite } from '../../../modules/entity/route_site.entity';
import { RouteSiteProgress } from '../../../modules/entity/route_site_progress.entity';
import { Supplier } from '../../../modules/entity/supplier.entity';
import { EmailService } from '../email/email.service';
import { FaultyCustomerService } from '../faultyCustomer/faultyCustomer.service';
import { RouteService } from '../route/route.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(RouteSite)
    private readonly routeSiteRepository: Repository<RouteSite>,
    @InjectRepository(RouteProgress)
    private readonly routeProgressRepository: Repository<RouteProgress>,
    @InjectRepository(RouteSiteProgress)
    private readonly routeSiteProgressRepository: Repository<RouteSiteProgress>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,

    @InjectRepository(PolygonSites)
    private readonly polygonSitesRepository: Repository<PolygonSites>,
    @InjectRepository(Polygon)
    private readonly polygonRepository: Repository<Polygon>,
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @Inject(forwardRef(() => CustomerAddressService))
    private readonly customerAddressService: CustomerAddressService,
    @Inject(forwardRef(() => SupplierService))
    private readonly supplierService: SupplierService,
    @Inject(forwardRef(() => SupplierPincodeService))
    private readonly supplierPincodeService: SupplierPincodeService,
    @Inject(forwardRef(() => FaultyCustomerService))
    private readonly faultyCustomerService: FaultyCustomerService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => RouteService))
    private readonly routeService: RouteService,
    @Inject(forwardRef(() => ContractService))
    private readonly contractService: ContractService,
  ) { }

  async create(payload: any): Promise<Customer> {
    try {
      const isAccountCodeIsExist = await this.findOne({
        account_code: payload.account_no,
      });
      if (isAccountCodeIsExist) {
        throw new Error('Account Code Is Already Exist');
      }
      const isDebtorCodeIsExist = await this.findOne({
        debtor_no: payload.debtor_no,
      });
      if (isDebtorCodeIsExist) {
        throw new Error('Debtor Code Is Already Exist');
      }
      for (const address of payload.address) {
        const isDescIsExist = await this.customerAddressRepository.findOne({
          desc: address.desc,
        });
        if (isDescIsExist) {
          throw new Error('Desc code is already exist');
        }
      }
      const maxAccountCode = await this.getOneMaximumAccountNumber();
      const account_code = (parseInt(maxAccountCode, 10) + 1).toString();
      const supplier = await this.supplierService.findOne({
        name: payload.supplier,
      });
      const customer = new Customer();

      // fields are verified by dto file
      customer.name = payload.name;
      customer.mobile_no = payload.mobile_number;
      customer.status = payload.status;
      if (!payload.account_no) {
        customer.account_code = account_code;
      } else {
        customer.account_code = payload.account_no;
      }

      if (!payload.debtor_no) {
        customer.debtor_no = account_code;
      } else {
        customer.debtor_no = payload.debtor_no;
      }
      // customer.debtor_no = account_code;
      customer.supplier = supplier;
      customer.supplier_id = supplier.id;
      const newCustomer = await this.customerRepository.save(customer);
      for (const address of payload.address) {
        const maxdescCode =
          await this.customerAddressService.getOneMaximumAccountNumber();

        let desc_code = (parseInt(maxdescCode, 10) + 1).toString();
        if (address.desc) {
          desc_code = address.desc;
        }
        if (address.postal_code) {
          const isPincodeAvailable = await this.supplierPincodeService.findOne({
            pincode: address.postal_code,
          });
          if (!isPincodeAvailable) {
            await this.supplierPincodeService.create({
              pincode: address.postal_code,
              supplierId: supplier.id,
            });
          }
        }
        address.desc = desc_code;
        address.customer_id = newCustomer.id;
        address.customer_data = newCustomer;
        await this.customerAddressService.create(address);
      }

      // return address object
      return await this.findOne({ id: newCustomer.id }, ['customer_address']);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async customerInactiveActive(custAddress: string | any[], status: string) {
    try {
      if (status == 'Inactive') {
        if (custAddress.length > 0) {
          for (const site of custAddress) {
            if (site.id) {
              const routeSite = await this.routeSiteRepository.findOne({
                site_id: site.id,
              });

              if (routeSite) {
                await this.routeService.removeSequnece(site.id);
                await this.routeSiteProgressRepository.softDelete({
                  site_id: site.id,
                });

                await this.routeSiteRepository.softDelete({ site_id: site.id });
              }
              await this.polygonSitesRepository.softDelete({
                site_id: site.id,
              });
            }
          }
        }
      }
    } catch (err) {
      throw err;
    }
  }

  async updateCustomer(payload: any, customerId: number): Promise<Customer> {
    try {
      const customer = await this.findOne({ id: customerId }, [
        'customer_address',
        'supplier',
      ]);
      if (!customer) {
        throw new NotFoundException('customer not found');
      }
      if (payload.name) {
        customer.name = payload.name;
      }
      if (payload.mobile_number) {
        customer.mobile_no = payload.mobile_number;
      }
      if (payload.status) {
        customer.status = payload.status;
      }
      if (payload.address) {
        const allIds = await this.getAllAddressIdsByCustomer(customerId);
        const availableId = [];
        for (const addr of payload.address) {
          if (addr.id) availableId.push(parseInt(addr.id, 10));
        }
        const unWantedIds = _.difference(allIds, availableId);
        if (unWantedIds.length)
          await this.customerAddressService.deleteUnWantedAddress(unWantedIds);
        for (const addr of payload.address) {
          if (addr.id) {
            const address = await this.customerAddressService.findOne({
              id: addr.id,
            });
            if (addr.type) {
              address.type = addr.type;
            }
            if (addr.street_name) {
              address.street_name = addr.street_name;
            }
            if (addr.latitude) {
              address.latitude = addr.latitude;
            }
            if (addr.sub_area) {
              address.sub_area = addr.sub_area;
            }
            if (addr.house_nr) {
              address.house_nr = addr.house_nr;
            }
            if (addr.house_nr_suffix) {
              address.house_nr_suffix = addr.house_nr_suffix;
            }

            if (addr.postal_code) {
              address.postal_code = addr.postal_code;
            }
            if (addr.city) {
              address.city = addr.city;
            }
            if (addr.country_code) {
              address.country_code = addr.country_code;
            }
            if (addr.longitude) {
              address.longitude = addr.longitude;
            }

            const addressInfo = await this.customerAddressRepository.save(
              address,
            );

            if (addr.latitude && addr.longitude) {
              const polySiteInfo = await this.polygonSitesRepository.findOne({
                where: { site_id: addressInfo.id, status: 'Active' },
                relations: ['polygon'],
              });
              console.log(polySiteInfo);

              if (polySiteInfo) {
                const route_region = [
                  JSON.parse(polySiteInfo.polygon.route_region),
                ];
                const myPolygon = poly(route_region);
                const sitePoint = point([addr.longitude, addr.latitude]);
                if (!turf(sitePoint, myPolygon)) {
                  await this.routeService.removeSequnece(addressInfo.id);
                  await this.routeSiteProgressRepository.softDelete({
                    site_id: addressInfo.id,
                  });

                  await this.routeSiteRepository.softDelete({
                    site_id: addressInfo.id,
                  });
                  await this.polygonSitesRepository.softDelete({
                    site_id: addressInfo.id,
                  });

                  const allPolygons = await this.polygonRepository
                    .createQueryBuilder('polygon')
                    .getMany();

                  for (const polygons of allPolygons) {
                    const route_region = [JSON.parse(polygons.route_region)];
                    const myPolygon = poly(route_region);
                    const sitePoint = point([addr.longitude, addr.latitude]);
                    if (turf(sitePoint, myPolygon)) {
                      if (polySiteInfo.polygon.id != polygons.id) {
                        // this is imp , for avaoiding duplication entries
                        const polygonSites = new PolygonSites();
                        polygonSites.polygon_id = polygons.id;
                        polygonSites.site_id = addressInfo.id;
                        polygonSites.status = 'Draft';

                        await this.polygonSitesRepository.save(polygonSites);
                      }
                    }
                  }
                }
              } else {
                const draftPolygon = await this.polygonSitesRepository.findOne({
                  where: { site_id: addressInfo.id, status: 'Draft' },
                  relations: ['polygon'],
                });
                const allPolygons = await this.polygonRepository
                  .createQueryBuilder('polygon')
                  .getMany();

                for (const polygons of allPolygons) {
                  const route_region = [JSON.parse(polygons.route_region)];
                  const myPolygon = poly(route_region);
                  const sitePoint = point([addr.longitude, addr.latitude]);
                  if (turf(sitePoint, myPolygon)) {
                    if (!draftPolygon) {
                      const polygonSites = new PolygonSites();
                      polygonSites.polygon_id = polygons.id;
                      polygonSites.site_id = addressInfo.id;
                      polygonSites.status = 'Draft';

                      await this.polygonSitesRepository.save(polygonSites);
                    } else {
                      if (draftPolygon.polygon.id != polygons.id) {
                        const polygonSites = new PolygonSites();
                        polygonSites.polygon_id = polygons.id;
                        polygonSites.site_id = addressInfo.id;
                        polygonSites.status = 'Draft';

                        await this.polygonSitesRepository.save(polygonSites);
                      }
                    }
                  }
                }
              }
            }
          } else {
            const maxdescCode =
              await this.customerAddressService.getOneMaximumAccountNumber();
            const desc_code = (parseInt(maxdescCode, 10) + 1).toString();
            if (addr.postal_code) {
              const isPincodeAvailable =
                await this.supplierPincodeService.findOne({
                  pincode: addr.postal_code,
                });
              if (!isPincodeAvailable) {
                await this.supplierPincodeService.create({
                  pincode: addr.postal_code,
                  supplierId: customer.supplier.id,
                });
              }
            }
            addr.desc = desc_code;
            addr.customer_id = customer.id;
            delete customer.customer_address;
            addr.customer_data = customer;
            console.log(addr);
            await this.customerAddressService.create(addr);
          }
        }
      }

      if (payload.status == 'I') {
        if (payload.address.length > 0) {
          await this.customerInactiveActive(payload.address, 'Inactive');
        }
      } else {
        if (payload.address.length > 0) {
          await this.customerInactiveActive(payload.address, 'Active');
        }
      }
      const newCustomer = await this.customerRepository.save(customer);
      return await this.getCustomerWithAddress(newCustomer.id);
    } catch (err) {
      console.log(err);

      throw err;
    }
  }
  async getAllAddressIdsByCustomer(customerId: number) {
    try {
      const addresses = await this.customerAddressRepository
        .createQueryBuilder('addresses')
        .leftJoinAndSelect('addresses.customer_data', 'customer')
        .where('customer.id=:id', { id: customerId })
        .getMany();
      const ids = [];
      for (const address of addresses) {
        ids.push(address.id);
      }
      return ids;
    } catch (err) {
      throw err;
    }
  }
  async deleteCustomer(customerId: number) {
    try {
      const customer = await this.findOne({ id: customerId });
      if (!customer) {
        throw new NotFoundException('Record Not Found');
      }
      const customerAddresses = await this.customerAddressRepository.find({
        customer_id: customerId,
      });

      if (customerAddresses.length) {
        for (const site of customerAddresses) {
          await this.contractRepository.update(
            { address_id: site.id },
            { calendar: null },
          );
          const routeSite = await this.routeSiteRepository.findOne({
            site_id: site.id,
          });

          if (routeSite) {
            await this.routeService.removeSequnece(site.id);

            await this.routeSiteRepository.softDelete({ site_id: site.id });
            await this.routeSiteProgressRepository.softDelete({
              site_id: site.id,
            });
          }
          await this.polygonSitesRepository.softDelete({ site_id: site.id });
        }
      }
      await this.customerAddressService.deleteCustomerAddress(customerId);
      await this.customerRepository.softDelete(customer);
      await this.contractRepository.softDelete({ customer_id: customerId });
    } catch (err) {
      throw err;
    }
  }
  async getOneMaximumAccountNumber() {
    const query = this.customerRepository.createQueryBuilder('customer');
    query.select('MAX(customer.account_code)', 'max');
    const result = await query.getRawOne();
    return result.max;
  }

  async getCustomersData(request: { limit: number; page: number }) {
    try {
      const customerData = this.customerRepository
        .createQueryBuilder('customer')
        .leftJoinAndSelect('customer.supplier', 'supplier')
        .leftJoinAndSelect('customer.customer_address', 'customer_address');
      customerData.groupBy('customer.id');
      let limit = 10;
      if (request && request.limit) {
        limit = request.limit;
      }
      let page = 0;
      if (request && request.page) {
        page = request.page;
      }

      request = pick(request, ['limit', 'page']);

      bindDataTableQuery(request, customerData);

      const response = await new Pagination(customerData, Customer).paginate(
        limit,
        page,
        { relations: ['supplier', 'customer_address'] },
      );

      return response;
    } catch (error) {
      throw Error(error);
    }
  }
  async getSuppliersCustomer(supplierId: number, request: any) {
    try {
      const customerData = this.customerRepository
        .createQueryBuilder('customer')
        .leftJoinAndSelect('customer.supplier', 'supplier')
        .where('supplier.id =:id', { id: supplierId })
        .leftJoinAndSelect('customer.customer_address', 'customer_address')
        .leftJoinAndSelect('customer.contracts', 'contracts')
        .orderBy('customer.created_at', 'DESC');
      customerData.groupBy('customer.id');
      let limit = 10;
      if (request && request.limit) {
        limit = request.limit;
      }
      let page = 0;
      if (request && request.page) {
        page = request.page;
      }

      request = pick(request, ['limit', 'page']);

      bindDataTableQuery(request, customerData);

      const response = await new Pagination(customerData, Customer).paginate(
        limit,
        page,
        { relations: ['supplier', 'customer_address'] },
      );

      return response;
    } catch (error) {
      throw Error(error);
    }
  }

  async sitesWithoutPolygon() {
    try {
      const polygonSiteInfo = await this.polygonSitesRepository.find({
        where: { status: Not('Inactive') },
      });
      const allSitesInPolygon: [] = map(polygonSiteInfo, 'site_id');
      let sitesNotInPolygon: any;

      if (allSitesInPolygon.length > 0) {
        sitesNotInPolygon = await this.contractRepository
          .createQueryBuilder('contract')
          .leftJoinAndSelect('contract.address', 'address')
          .where('address.id NOT IN (:...allSitesInPolygon)', {
            allSitesInPolygon,
          })
          .getMany();
        // sitesNotInPolygon = await this.customerRepository
        //   .createQueryBuilder('customer')
        //   .leftJoinAndSelect('customer.supplier', 'supplier')
        //   .leftJoinAndSelect('customer.customer_address', 'customer_address')
        //   .where('customer_address.id NOT IN (:...allSitesInPolygon)', { allSitesInPolygon })
        //   .getMany();

        return sitesNotInPolygon;
      }

      return [];
    } catch (err) {
      throw err;
    }
  }

  async getCustomerWithAddress(customerId: number) {
    try {
      const customer = await this.findOne({ id: customerId }, [
        'customer_address',
        'supplier',
      ]);
      /*  const response = {
        name: customer.name,
      }; */
      return customer;
    } catch (err) {
      throw err;
    }
  }

  async findOne(where: any, relations: Array<any> = []): Promise<Customer> {
    return this.customerRepository.findOne({
      where: where,
      relations: relations,
    });
  }

  async getAvailableAddress(customerId: number): Promise<any> {
    try {
      const allContracts = await this.contractService.find({
        customer_id: customerId,
      });
      const occupiedAddressId = [];
      for (const contract of allContracts) {
        occupiedAddressId.push(contract.address_id);
      }
      const customers = await this.findOne(
        {
          id: customerId,
        },
        ['customer_address'],
      );
      const allAddress = customers.customer_address;
      const availableAddress = [];
      for (const address of allAddress) {
        const { id } = address;
        if (_.indexOf(occupiedAddressId, id) === -1) {
          availableAddress.push(address);
        }
      }
      return availableAddress;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async findOneAddress(
    where: any,
    relations: Array<any> = [],
  ): Promise<CustomerAddress> {
    return this.customerAddressRepository.findOne({
      where: where,
      relations: relations,
    });
  }

  async getAllAddress(existedIds: []): Promise<CustomerAddress[]> {
    try {
      if (existedIds.length) {
        const address = await this.customerAddressRepository
          .createQueryBuilder('address')
          .where('address.id NOT IN (:...existedIds)', { existedIds })
          .getMany();

        return address;
      } else {
        const address = await this.customerAddressRepository
          .createQueryBuilder('address')
          .getMany();

        return address;
      }
    } catch (err) {
      throw err;
    }
  }

  async readImogCustomers(): Promise<any> {
    try {
      // create basic ftp client
      const client = new basicFtp.Client();
      client.ftp.verbose = true;

      // imog credentials
      await client.access({
        host: 'tab.a3services.be',
        user: 'imog_tab',
        password: 'fSjk37#9',
        secure: false,
      });

      // set default directory for imog
      await client.ensureDir('/DEMO/Supplier/IMOG/Customer');

      // list all the files
      const allFiles = await client.list();

      const filtercsvFiles = (filename: string) => {
        return filename.split('.')[1] === 'xml';
      };
      const filterUnNecessaryFiles = (filename: string) => {
        return filename.split('.')[1] !== 'xml';
      };

      // filter xml file only
      const allCustomerXML = allFiles.filter((file) =>
        filtercsvFiles(file.name),
      );

      // get all unnecessary files
      const allUnnecessaryFiles = allFiles.filter((file) =>
        filterUnNecessaryFiles(file.name),
      );

      // sent mail to client to inform about unnecessary files
      for (const unNecessaryFile of allUnnecessaryFiles) {
        const user = await this.userService.getAdmin();
        const data = {
          to: null,
          context: {
            name: null,
            supplier: null,
            file: null,
            error: null,
          },
        };
        data.to = user.email;
        data.context = {
          name: user.name,
          supplier: 'IMOG',
          file: unNecessaryFile,
          error: `unknown file extension found for file ${unNecessaryFile}`,
        };
        await this.emailService.FileNotTransferredSuccessFully(data);
      }

      for (const file of allCustomerXML) {
        // check file is already faulty
        const checkIsFileFaulty = await this.faultyCustomerService.findOne({
          file_name: file.name,
        });
        if (checkIsFileFaulty) {
          // if file is already faulty then move to next file
          continue;
        }

        let transferFile = true;

        // store the file into buffer with writable stream
        const writableStream = new streamBuffers.WritableStreamBuffer({
          initialSize: 100 * 1024, // start at 100 kilobytes.
          incrementAmount: 10 * 1024, // grow by 10 kilobytes each time buffer overflows.
        });

        await client.downloadTo(writableStream, file.name);
        const data = writableStream.getContentsAsString();
        let jsonData: any;

        // convert xml-string into json
        parseString(data, function (_err: any, results: any) {
          jsonData = results;
        });

        const customers = jsonData.Accounts.Account;

        for (const customer of customers) {
          let isCustomerFaulty = false;

          /*
            Customer code and debtor number is required
            In address Desc, Street Name ,House Nr, Latitude and Longitude required
          */

          if (!customer.Code || !customer.DebtorNr) {
            isCustomerFaulty = true;
          }

          const customerAvailable = await this.customerRepository.findOne({
            account_code: customer.Code[0],
          });

          if (customerAvailable) {
            isCustomerFaulty = true;
          }
          for (const address of customer.Addresses[0].Address) {
            if (
              !address.Desc ||
              !address.Streetname ||
              !address.HouseNr ||
              !address.Latitude ||
              !address.Longitude
            ) {
              isCustomerFaulty = true;
            }
            if (address.Desc[0]) {
              const addressAvailable =
                await this.customerAddressRepository.findOne({
                  desc: address.Desc[0],
                });

              if (addressAvailable) {
                isCustomerFaulty = true;
              }
            }
          }

          // if customer is not faulty then add it to customer table
          // else add it to faulty customer address
          if (!isCustomerFaulty) {
            const newCustomer = new Customer();

            newCustomer.account_code = data.Code[0];

            newCustomer.debtor_no = data.DebtorNr[0];

            newCustomer.status = data.Status[0];

            const supplierInfo = await this.supplierRepository.findOne({
              name: 'IMOG',
            });
            newCustomer.supplier_id = supplierInfo.id;

            // save customer
            const customerInfo = await this.customerRepository.save(
              newCustomer,
            );
            for (const addressInfo of customer.Addresses[0].Address) {
              // create address for the customer
              if (customerInfo) {
                await this.customerAddressService.insertAddressData(
                  addressInfo,
                  customerInfo.id,
                );
              }
            }
          } else {
            transferFile = false;
            const payload = {
              account_code: null,
              debtor_no: null,
              status: null,
              supplier_id: null,
              file_name: null,
            };
            if (customer.Code) payload.account_code = customer.Code[0];

            if (customer.DebtorNr) payload.debtor_no = customer.DebtorNr[0];

            if (customer.Status) payload.status = customer.Status[0];
            const supplierInfo = await this.supplierRepository.findOne({
              name: 'IMOG',
            });
            payload.supplier_id = supplierInfo.id;
            payload.file_name = file.name;
            const faultyCustomer =
              await this.faultyCustomerService.createCustomer(payload);
            for (const addressInfo of customer.Addresses[0].Address) {
              const payload = {
                type: null,
                desc: null,
                street_name: null,
                customer_id: faultyCustomer.id,
                house_nr: null,
                house_nr_suffix: null,
                latitude: null,
                longitude: null,
                postal_code: null,
                sub_area: null,
                city: null,
                country_code: null,
              };
              if (addressInfo.Type) {
                payload.type = addressInfo.Type[0];
              }

              if (addressInfo.Desc) {
                payload.desc = addressInfo.Desc[0];
              }
              if (addressInfo.Latitude) {
                payload.latitude = addressInfo.Latitude[0];
              }
              if (addressInfo.Longitude) {
                payload.longitude = addressInfo.Longitude[0];
              }

              if (addressInfo.Streetname) {
                payload.street_name = addressInfo.Streetname;
              }

              if (addressInfo.HouseNr) {
                payload.house_nr = addressInfo.HouseNr[0];
              }
              if (addressInfo.HouseNr_Suffix) {
                payload.house_nr_suffix = addressInfo.HouseNr_Suffix[0]; //payload.HouseNr_Suffix is {}
              }
              if (addressInfo.PostalCode) {
                payload.postal_code = addressInfo.PostalCode[0];
              }
              if (addressInfo.TeilOrt) {
                payload.sub_area = addressInfo.TeilOrt[0];
              }
              if (addressInfo.City) {
                payload.city = addressInfo.City[0];
              }
              if (addressInfo.Country_code) {
                payload.country_code = addressInfo.Country_code[0];
              }

              await this.faultyCustomerService.createCustomerAddress(payload);
            }
          }
        }
        if (transferFile) {
          const user = await this.userService.getAdmin();
          const data = {
            to: null,
            context: {
              name: null,
              supplier: null,
              file: null,
            },
          };
          data.to = user.email;
          data.context = {
            name: user.name,
            supplier: 'IMOG',
            file: file,
          };
          await this.emailService.FileTransferSuccessFully(data);
          await client.rename(file.name, `../Archive/Customer/${file.name}`);
        }
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async moveImogCustomerFile(file_name: string): Promise<any> {
    try {
      const client = new basicFtp.Client();
      client.ftp.verbose = true;

      // imog credentials
      await client.access({
        host: 'tab.a3services.be',
        user: 'imog_tab',
        password: 'fSjk37#9',
        secure: false,
      });

      // set default directory for imog
      await client.ensureDir('/DEMO/Supplier/IMOG/Customer');
      await client.rename(file_name, `../Archive/Customer/${file_name}`);
    } catch (err) {
      throw err;
    }
  }
}
