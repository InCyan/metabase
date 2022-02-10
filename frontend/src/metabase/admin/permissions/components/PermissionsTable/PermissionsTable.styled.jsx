import styled from "@emotion/styled";

import { color, alpha, lighten } from "metabase/lib/colors";
import Link from "metabase/core/components/Link";
import Icon from "metabase/components/Icon";
import Label from "metabase/components/type/Label";

export const PermissionsTableRoot = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

export const PermissionsTableRow = styled.tr`
  border-top: 1px solid ${alpha(color("border"), 0.5)};
`;

export const PermissionsTableCell = styled.td`
  height: 40px
  width: auto;
  min-width: 220px;
  vertical-align: center;

  &:first-of-type {
    padding: 0.625rem;
    background: white;
    left: 0;
    position: sticky;
    max-width: 340px;
    padding-left: 0;
  }
`;

export const EntityNameCell = styled(PermissionsTableCell)`
  min-width: 280px;
  display: flex;
  align-items: center;
`;

export const EntityName = styled.div`
  font-weight: 700;
`;

export const EntityNameLink = styled(Link)`
  font-weight: 700;
  text-decoration: underline;
  color: ${color("admin-navbar")};
`;

export const PermissionTableHeaderRow = styled.tr``;

export const HintIcon = styled(Icon)`
  color: ${lighten("text-dark", 0.3)};
  margin-left: 0.375rem;
  cursor: pointer;
`;

export const ColumnName = styled(Label)`
  margin: 0;
`;

HintIcon.defaultProps = {
  name: "info",
  size: 12,
};
