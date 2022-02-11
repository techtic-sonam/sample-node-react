import styled from 'styled-components';
import theme from 'theme';
import { toRem } from '../utils';
import { Row, Col } from 'react-bootstrap';

type EducatorProps = {
    lowerBackground?: string;
    upperBackground?: string;
    background?: string | undefined;
    textcolor?: string | undefined;
};

export const EducatorCardStyle = styled.div<EducatorProps>`
    background: linear-gradient(
        to top,
        ${(props) => props.lowerBackground} 0%,
        ${(props) => props.lowerBackground} 35%,
        ${(props) => props.upperBackground} 35%,
        ${(props) => props.upperBackground} 100%
    );
`;

export const EducatorCardRow = styled(Row)`
    padding: ${toRem(40)} ${toRem(14)};
`;

export const EducatorCardCol = styled(Col)<EducatorProps>`
    &.details {
        background: ${(props) => props.background || theme.background.light};
        padding: ${toRem(39)} ${toRem(52.5)} ${toRem(39)} ${toRem(57.5)};
        color: ${(props) => props.textcolor || theme.black};
        @media (max-width: 769px) {
            padding: ${toRem(25)};
        }
    }
    &.banner {
        background: ${(props) => props.background || theme.background.light};
        padding: ${toRem(23)} ${toRem(115)} ${toRem(39)} ${toRem(110)};
        color: ${(props) => props.textcolor || theme.black};
        @media (max-width: 1025px) {
            padding: ${toRem(23)} ${toRem(60)} ${toRem(39)} ${toRem(70)};
        }
        @media (max-width: 769px) {
            padding: ${toRem(10)} ${toRem(20)} 0;
        }
        @media (max-width: 450px) {
            padding: ${toRem(10)} 0 0;
        }
    }
    &.img {
        background: ${(props) => props.bgcolor || theme.yellow.secondary};
        padding: 0;
        max-width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        @media (max-width: 991px) {
            max-width: inherit;
        }
    }
`;

export const EducatorName = styled.h3`
    font-size: ${toRem(34)};
    line-height: ${toRem(38)};
    &.banner {
        font-size: ${toRem(48)};
        line-height: ${toRem(57.6)};
        color: ${theme.white};
        @media (max-width: 450px) {
            font-size: ${toRem(38)};
        }
    }
    @media (max-width: 450px) {
        font-size: ${toRem(30)};
    }
`;

export const EducatorDesc = styled.p`
    font-size: ${toRem(14)};
    line-height: ${toRem(18)};
    margin-bottom: ${toRem(50)};
    &.banner {
        font-size: ${toRem(18)};
        line-height: ${toRem(24)};
        @media (max-width: 450px) {
            font-size: ${toRem(16)};
        }
    }
    &.title {
        font-size: ${toRem(18)};
        line-height: ${toRem(24)};
        margin: ${toRem(9)} 0 ${toRem(24)};
    }
`;
