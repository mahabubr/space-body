import type { PublishedNumericalObservation } from "./types";

export function getObservationMetricName(obs: PublishedNumericalObservation): string {
  if (obs.metric) {
    return obs.metric.replace(/_/g, " ").toUpperCase();
  }
  if (obs.metrics && obs.metrics.length > 0) {
    return obs.metrics.map((m) => m.metric.replace(/_/g, " ")).join(", ").toUpperCase();
  }
  return obs.observation_id.replace(/_/g, " ");
}

export function formatObservationValue(obs: PublishedNumericalObservation): string {
  if (obs.comparator && obs.value !== undefined && obs.value !== null) {
    return `${obs.comparator} ${obs.value}${obs.unit ? " " + obs.unit : ""}`;
  }
  if (obs.value_range) {
    const min = obs.value_range.minimum;
    const max = obs.value_range.maximum;
    const unit = obs.unit ? ` ${obs.unit}` : "";
    return `${min} - ${max}${unit}`;
  }
  if (
    obs.value_before_mmol_per_litre !== undefined &&
    obs.value_after_mmol_per_litre !== undefined
  ) {
    return `${obs.value_before_mmol_per_litre} → ${obs.value_after_mmol_per_litre} mmol/L`;
  }
  if (obs.value_before_ml !== undefined && obs.value_after_ml !== undefined) {
    return `${obs.value_before_ml} → ${obs.value_after_ml} mL`;
  }
  if (obs.direction) {
    const dir = obs.direction.replace(/_/g, " ");
    const pVal =
      obs.statistical_result?.p_value !== undefined
        ? ` (p = ${obs.statistical_result.p_value})`
        : "";
    return `${dir}${pVal}`;
  }
  if (obs.metrics && obs.metrics.length > 0) {
    return `${obs.metrics.length} Reported Structural Adaptations`;
  }
  if (obs.value !== null && obs.value !== undefined) {
    return `${obs.value}${obs.unit ? " " + obs.unit : ""}`;
  }
  if (obs.statistical_result) {
    if (obs.statistical_result.q_value) {
      return `q ${obs.statistical_result.q_value}`;
    }
    if (obs.statistical_result.p_value !== undefined) {
      return `p = ${obs.statistical_result.p_value}`;
    }
  }
  if (obs.model_estimate) {
    return `${obs.model_estimate.value} ${obs.model_estimate.unit || ""}`;
  }
  return "Documented in Publication";
}