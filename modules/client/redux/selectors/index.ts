import { AppSelectors } from "client/redux/selectors/app-selectors";
import { ComboDataSelectors } from "client/redux/selectors/combodata-selectors";
import { ProcessDataSelectors } from "client/redux/selectors/processdata-selectors";

export const Selectors = {
  App: AppSelectors,
  ComboData: ComboDataSelectors,
  ProcessData: ProcessDataSelectors,
};
