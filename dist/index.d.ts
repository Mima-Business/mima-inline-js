export type CurrencyCode =
  | "USD"
  | "AED"
  | "AFN"
  | "ALL"
  | "AMD"
  | "ANG"
  | "AOA"
  | "ARS"
  | "AUD"
  | "AWG"
  | "AZN"
  | "BAM"
  | "BBD"
  | "BDT"
  | "BGN"
  | "BIF"
  | "BMD"
  | "BND"
  | "BOB"
  | "BRL"
  | "BSD"
  | "BWP"
  | "BYN"
  | "BZD"
  | "CAD"
  | "CDF"
  | "CHF"
  | "CLP"
  | "CNY"
  | "COP"
  | "CRC"
  | "CVE"
  | "CZK"
  | "DJF"
  | "DKK"
  | "DOP"
  | "DZD"
  | "EGP"
  | "ETB"
  | "EUR"
  | "FJD"
  | "FKP"
  | "GBP"
  | "GEL"
  | "GIP"
  | "GMD"
  | "GNF"
  | "GTQ"
  | "GYD"
  | "HKD"
  | "HNL"
  | "HTG"
  | "HUF"
  | "IDR"
  | "ILS"
  | "INR"
  | "ISK"
  | "JMD"
  | "JPY"
  | "KES"
  | "KGS"
  | "KHR"
  | "KMF"
  | "KRW"
  | "KYD"
  | "KZT"
  | "LAK"
  | "LBP"
  | "LKR"
  | "LRD"
  | "LSL"
  | "MAD"
  | "MDL"
  | "MGA"
  | "MKD"
  | "MMK"
  | "MNT"
  | "MOP"
  | "MUR"
  | "MVR"
  | "MWK"
  | "MXN"
  | "MYR"
  | "MZN"
  | "NAD"
  | "NGN"
  | "NIO"
  | "NOK"
  | "NPR"
  | "NZD"
  | "PAB"
  | "PEN"
  | "PGK"
  | "PHP"
  | "PKR"
  | "PLN"
  | "PYG"
  | "QAR"
  | "RON"
  | "RSD"
  | "RUB"
  | "RWF"
  | "SAR"
  | "SBD"
  | "SCR"
  | "SEK"
  | "SGD"
  | "SHP"
  | "SLE"
  | "SOS"
  | "SRD"
  | "STD"
  | "SZL"
  | "THB"
  | "TJS"
  | "TOP"
  | "TRY"
  | "TTD"
  | "TWD"
  | "TZS"
  | "UAH"
  | "UGX"
  | "UYU"
  | "UZS"
  | "VND"
  | "VUV"
  | "WST"
  | "XAF"
  | "XCD"
  | "XCG"
  | "XOF"
  | "XPF"
  | "YER"
  | "ZAR"
  | "ZMW";

export interface OrderItem {
  item: string;
  quantity: number;
  unitPrice: number;
}

export interface BookingInfo {
  id: string;
  sessionDateTime: string;
}

export type CustomerInfo = {
  fullname: string;
  email: string;
  mobile?: string;
  street?: string;
  country?: string;
  companyName?: string;
  postCode?: string;
  state?: string;
};

export interface OrderProps {
  items: OrderItem[];
  currencyCode: CurrencyCode;
  shipping?: number;
  orderId: string;
}

export interface CheckoutPayload {
  customer: CustomerInfo;
  publicKey: string;
  order: OrderProps;
  callBackUrl?: string;
}

export interface CheckoutOptions {
  payload: CheckoutPayload;
  signature: string | HTMLElement;
  testMode?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

export type CheckoutButton = CheckoutOptions & {
  selector: string;
  title?: string;
  className?: string;
};

export const MimaCheckout: {
  open: (opts: CheckoutOptions) => void;
  renderButton: (opts: CheckoutButton) => HTMLElement;
  renderOption: (opts: CheckoutButton) => HTMLElement;
};

export default MimaCheckout;
