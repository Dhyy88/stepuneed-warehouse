const ApiEndpoint = {
  // AUTH AREA
    LOGIN: 'ho/auth/login',
    DETAIL: 'ho/account',

  //HO ACCOUNT
    HO: 'ho/hos',
    HO_CREATE: 'ho/hos/create',

   // SALES EXTERNAL AREA 
    SALES_EXTERNAL: 'ho/armies',
    CREATE_SALES_EXTERNAL: 'ho/armies/create',

    // DEALER AREA
    DEALER: 'ho/dealers',
    CREATE_DEALER: 'ho/dealers/create',

    // CARS AREA
    CARS: 'ho/car-models',
    CREATE_CARS: 'ho/car-models/create',

    //SITE AREA
    SITES: 'ho/sites',
    CREATE_SITES: 'ho/sites/create',
    STORE_LIST: 'ho/sites/store',
    WAREHOUSE_LIST: 'ho/sites/warehouse',

    //CATEGORY
    CATEGORY: 'ho/categories',
    CREATE_CATEGORY: 'ho/categories/create',

    //ADMINISTRATIVE AREA PUBLIC
    GET_PROVINCE: 'administrative-area/provinces',
    GET_CITIES: 'administrative-area/cities'
  }
  
  export default ApiEndpoint
  