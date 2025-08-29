import type {
  CampaignData,
  CreditCard,
  LoginCredentials,
  PersonalInfo,
  UpsellDownsellAmounts,
} from "../types";

export const TestDataFactory = {
  getValidPersonalInfo(): PersonalInfo {
    return {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
    };
  },

  getValidCreditCard(): CreditCard {
    return {
      number: "4111 1111 1111 1111",
      expiry: "11/30",
      cvv: "111",
    };
  },

  getInvalidCreditCard(): CreditCard {
    return {
      number: "4999 9999 9999 9999",
      expiry: "11/30",
      cvv: "111",
    };
  },

  get3DS2CreditCard(): CreditCard {
    return {
      number: "4000 0000 0000 3220",
      expiry: "11/30",
      cvv: "111",
    };
  },

  get3DS2FrictionlessCreditCard(): CreditCard {
    return {
      number: "4222222222222220",
      expiry: "11/30",
      cvv: "111",
    };
  },

  getInsufficientFundsCreditCard(): CreditCard {
    return {
      number: "4000-0000-0000-0077",
      expiry: "11/30",
      cvv: "111",
    };
  },

  getExpiredCreditCard(): CreditCard {
    return {
      number: "4000-0000-0000-0069",
      expiry: "11/30",
      cvv: "111",
    };
  },

  getCampaignData(): CampaignData {
    return {
      title: "Automated Test Campaign",
      description: "This is an automated test campaign",
      goal: "5,0000",
      country: "Canada",
      postalCode: "A2A 2A5",
      category: "Palestine",
      recipientType: "Charity",
      charityIndex: 0,
      imagePath: "./assets/cover-image.png",
    };
  },

  getLoginCredentials(): LoginCredentials {
    return {
      email: process.env.TEST_EMAIL,
      password: process.env.TEST_PASSWORD,
    };
  },

  getUpsellDownsellAmounts(): UpsellDownsellAmounts {
    return {
      upsellAmount: 25 * 1.17,
      downsellAmount: 10 * 1.17,
    };
  },
};
