import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { CustomerDTO } from 'src/shared/dto/customer.dto';
import { ContractService } from 'src/shared/services/contract/contract.service';
import { CustomerService } from 'src/shared/services/customer/customer.service';
@Controller('api/customer')
export class CustomerController {
  constructor(
    private customerService: CustomerService,
    private contractService: ContractService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('insertCust')
  async inserCustomer(
    @Request() request: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const resp = await this.customerService.readImogCustomers();
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: resp,
      });
      // const resp = await this.contractService.readImogCsvFiles()

      // res.status(HttpStatus.OK).json({
      //   status: HttpStatus.OK,
      //   data: [],
      // });
    } catch (err) {
      console.log(err);
      throw new UnprocessableEntityException(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createCustomer(
    @Body() body: CustomerDTO,

    @Res() res: Response,
  ): Promise<any> {
    try {
      const response = await this.customerService.create(body);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: response,
      });
    } catch (err) {
      if (err.message) {
        throw new UnprocessableEntityException(err.message);
      } else {
        throw new UnprocessableEntityException(err);
      }
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('available-address/:id')
  async getAvailableAddress(
    @Param('id') customerId: number,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const resp = await this.customerService.getAvailableAddress(customerId);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: resp,
      });
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('supplier/:id')
  async getSuppliersCustomer(
    @Request() request: any,
    @Param('id') supplierId: number,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const resp = await this.customerService.getSuppliersCustomer(
        supplierId,
        request.query,
      );
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: resp,
      });
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getCustomers(
    @Request() request: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const resp = await this.customerService.getCustomersData(request.query);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: resp,
      });
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getSiteNotInRoute')
  async getCustomerNotinPoly(@Res() res: Response): Promise<any> {
    try {
      const response = await this.customerService.sitesWithoutPolygon();
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: response,
      });
    } catch (err) {
      if (err.message) {
        throw new UnprocessableEntityException(err.message);
      } else {
        throw new UnprocessableEntityException(err);
      }
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getCustomersWithAddress(
    @Param('id') customerId: number,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const resp = await this.customerService.getCustomerWithAddress(
        customerId,
      );
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: resp,
      });
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteCustomer(
    @Param('id') customerId: number,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const resp = await this.customerService.deleteCustomer(customerId);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Customer Deleted Successfully!',
      });
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateCustomer(
    @Param('id') customerId: number,
    @Res() res: Response,
    @Body() body: any,
  ): Promise<any> {
    try {
      const resp = await this.customerService.updateCustomer(body, customerId);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: resp,
      });
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('insertFaultyCust')
  async insertFaultyCustomer(
    @Request() request: any,
    @Body() body: any,
    @Res() res: Response,
  ): Promise<any> {
    try {
      /*  const resp: any = await this.customerService.insertFaultyCustomerData(
        body,
      ); */
      const resp = await this.customerService.readImogCustomers();
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: resp,
      });
    } catch (err) {
      throw new UnprocessableEntityException(err);
    }
  }
}
