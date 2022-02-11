/* eslint-disable jsx-a11y/anchor-is-valid */
import { convertToSlug } from '@components/utils';
import { Educator } from '@queries/educators';
import { FC, ReactNode } from 'react';
import { EducatorCardStyle, EducatorCardRow, EducatorCardCol, EducatorName, EducatorDesc } from './style';
import { GlobalContainerStyle } from '@components/Global/style';
import Button from '@components/Button';
import theme from '../../theme';
import Link from 'next/link';
import ImageShaper from '@components/ImageShaper';
import { ShapeType } from '@components/ImageShaper/types';

type EducatorCardProps = {
    children?: ReactNode;

    educator?: Educator;

    upperBackground?: string;
    lowerBackground?: string;
    color?: string;
    background?: string;
    textcolor?: string;
    button?: string;
    banner?: boolean;

    isClassDetails?: boolean;
};

const EducatorCard: FC<EducatorCardProps> = ({
    educator,

    upperBackground,
    lowerBackground,
    color,
    background,
    textcolor,
    button,
    banner,

    children,

    isClassDetails,
}) => {
    const educatorPhoto = educator?.avatar.url;
    const educatorName = educator?.fullName;
    const path = educator ? convertToSlug(educator.fullName) : '';
    const title = educator?.profile.tagline;
    const educatorId = educator?.id;
    return (
        <EducatorCardStyle upperBackground={upperBackground} lowerBackground={lowerBackground}>
            <GlobalContainerStyle>
                <EducatorCardRow>
                    <EducatorCardCol className="img" md="auto" bgcolor={color}>
                        {isClassDetails ? (
                            <Link href={{ pathname: `/educator/${path}`, query: { id: educatorId } }} passHref>
                                <a>
                                    <ImageShaper
                                        image={educatorPhoto}
                                        shape={ShapeType.circle}
                                        shapeColor={color || theme.yellow.secondary}
                                        imgHeight={317}
                                        imgWidth={317}
                                    />
                                </a>
                            </Link>
                        ) : (
                            <ImageShaper
                                image={educatorPhoto}
                                shape={ShapeType.circle}
                                shapeColor={color || theme.yellow.secondary}
                                imgHeight={317}
                                imgWidth={317}
                            />
                        )}
                    </EducatorCardCol>
                    <EducatorCardCol
                        className={banner ? `banner` : 'details'}
                        background={background}
                        textcolor={textcolor}
                    >
                        {isClassDetails ? (
                            <Link href={{ pathname: `/educator/${path}`, query: { id: educatorId } }} passHref>
                                <a>
                                    <EducatorName className={banner ? `banner` : ''}>{educatorName}</EducatorName>
                                </a>
                            </Link>
                        ) : (
                            <EducatorName className={banner ? `banner` : ''}>{educatorName}</EducatorName>
                        )}

                        <EducatorDesc className="title">{title}</EducatorDesc>
                        <EducatorDesc className={banner ? `banner` : ''}>{children}</EducatorDesc>
                        {button && (
                            <Link href={{ pathname: `/educator/${path}`, query: { id: educatorId } }} passHref>
                                <a>
                                    <Button bgcolor={color} color={theme.black} rightIcon>
                                        {button}
                                    </Button>
                                </a>
                            </Link>
                        )}
                    </EducatorCardCol>
                </EducatorCardRow>
            </GlobalContainerStyle>
        </EducatorCardStyle>
    );
};

export default EducatorCard;
