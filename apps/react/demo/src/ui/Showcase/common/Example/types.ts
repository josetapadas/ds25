import type { FieldProps } from "@canonical/react-ds-core-form";
import { ORIGINAL_VAR_NAME_KEY } from "data/index.js";
import type { FormValues } from "hooks/index.js";
import type { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";
import type { ControlsProps, RendererProps } from "./common/index.js";

export type ExampleSettingValue = number | string;
export type ExampleOutputFormat = "css";

/** The value of the config context */
export interface ContextOptions {
  /** The current active example name */
  activeExampleIndex?: number;
  /** The function to set the active example name. Use this to change which example is currently active. */
  setActiveExampleIndex: Dispatch<SetStateAction<number>>;
  /** All examples that can be controlled by this provider */
  allExamples: ShowcaseExample[];
  /** The currently active example's parameters */
  activeExample: ShowcaseExample;
  /** Resets the active example to its default state */
  resetActiveExample: () => void;
  /** The output values (e.g. CSS) for the currently active example */
  demoOutput: Output;
  /** Function to copy the output values of a format  */
  copyOutput: (format: ExampleOutputFormat) => void;
  /** Switches to the previous example */
  activatePrevExample: () => void;
  /** Switches to the next example */
  activateNextExample: () => void;
  /** The settings for the current active example */
  activeExampleFormValues: FormValues;
  /** Whether the baseline grid should be shown */
  showBaselineGrid: boolean;
  /** Toggles the baseline grid's visibility. */
  toggleShowBaselineGrid: () => void;
}

/** The context provider props for the config provider */
export interface ProviderProps {
  /** The children to render, which will have access to the config context */
  children: ReactNode;
  /** The output formats that the provider should support */
  outputFormats?: ExampleOutputFormat[];
}

export interface FormSection {
  title: string;
  /**
   * Array defining the controls and their initial/default configuration for this example.
   * The `value` property within these initial configs is often ignored, as the
   * state initialization will typically set `value` based on `default`.
   */
  fields: ExampleControlField[];
}

/**
 * Valid keys for field transformer functions.
 */
export type TransformerFnKey =
  /**
   * Default transformer function to apply to output values.
   * This is always applied to export values.
   * If the `demoTransformer` is not set, this will be used for demo output as well.
   * */
  | "transformer"
  /**
   * Transformer function to apply to demo output values
   * If not set, the `transformer` function will be used instead
   * */
  | "demoTransformer";

/**
 * Mapping of transformer function keys to their respective transformer functions
 * Each function is optional.
 * */
export type TransformerFns = {
  [key in TransformerFnKey]?: (
    value: ExampleSettingValue,
  ) => ExampleSettingValue;
};

export interface ExampleControlField extends FieldProps, TransformerFns {
  name: string;
  /** Formats for which output is disabled */
  disabledOutputFormats?: {
    [key in ExampleOutputFormat]?: boolean;
  };
  /**
   * A default value for the control field.
   * This is not directly consumed by the field, but it is used to set the initial value in the form state.
   */
  defaultValue?: ExampleSettingValue;

  [ORIGINAL_VAR_NAME_KEY]?: string;
}

/** The actual component that is rendered for an example. */
export type ShowcaseComponent = (state: FormValues) => ReactElement;

/** The props for constructing a ShowcaseExample */
export interface ShowcaseExample {
  /** Unique identifier name */
  name: string;
  /** User-friendly description */
  description: string;
  /** The component to render */
  Component: ShowcaseComponent;
  /** The categories of fields associated with this example */
  sections: FormSection[];
}

export type ExampleComponent = ((props: ProviderProps) => ReactElement) & {
  Controls: (props: ControlsProps) => ReactElement | null;
  Renderer: (props: RendererProps) => ReactElement | null;
};

// biome-ignore lint/suspicious/noExplicitAny: Output types could have any shape
export type Output = { [key in ExampleOutputFormat]?: any };
