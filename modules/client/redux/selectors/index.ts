import { AppSelectors } from "client/redux/selectors/app-selectors";
import { ComboDataSelectors } from "client/redux/selectors/combodata-selectors";
import { ProcessDataSelectors } from "client/redux/selectors/processdata-selectors";
import { AuthenticationSelectors } from "./authentication-selectors";

export const Selectors = {
  App: AppSelectors,
  Authentication: AuthenticationSelectors,
  ComboData: ComboDataSelectors,
  ProcessData: ProcessDataSelectors,
};
