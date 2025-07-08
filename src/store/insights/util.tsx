import { Trans } from "@lingui/react/macro"
import { ALERT_TYPE, ContractAnomalyOptions, InsightsDataType, InstitutionalTradeOptions, MOVEMENT_TYPE, PriceAlertOptions, PriceChange24hOptions, SIDE } from "./insights.d"
export function getInsightSide(data: InsightsDataType) {
  const isLong = getIsInsightLong(data)
  if (data.alertType === ALERT_TYPE.DERIVATIVES_ALERT) {
    return <Trans>Funding Rate</Trans>
  } else if (data.alertType === ALERT_TYPE.CONTRACT_ANOMALY) {
    return <Trans>Volume</Trans>
  } else if (data.alertType === ALERT_TYPE.NEWS_ALERT) {
    return <Trans>News</Trans>
  }
  return isLong ? <Trans>Pump</Trans> : <Trans>Dump</Trans>
}

export function getIsInsightLong(data: InsightsDataType) {
  const { alertType, alertOptions } = data;
  const { side } = alertOptions as InstitutionalTradeOptions;
  const { movementType } = alertOptions as PriceAlertOptions;
  const { priceChange24h } = alertOptions as PriceChange24hOptions;
  const { action } = alertOptions as ContractAnomalyOptions;
  if (alertType === ALERT_TYPE.INSTITUTIONAL_TRADE) {
    return side === SIDE.BUY
  } else if (alertType === ALERT_TYPE.PRICE_ALERT || alertType === ALERT_TYPE.DERIVATIVES_ALERT || alertType === ALERT_TYPE.NEWS_ALERT) {
    return movementType === MOVEMENT_TYPE.PUMP || movementType === '+'
  } else if (alertType === ALERT_TYPE.PRICE_CHANGE_24H) {
    return priceChange24h > 0
  } else if (alertType === ALERT_TYPE.CONTRACT_ANOMALY) {
    return action === 'long'
  }
  return false
}