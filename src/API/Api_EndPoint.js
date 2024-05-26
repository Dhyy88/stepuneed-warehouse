const ApiEndpoint = {
  // AUTH AREA
    LOGIN: 'warehouse/auth/login',
    LOGOUT: 'warehouse/auth/logout',
    DETAIL: 'warehouse/account',
    CHANGE_PASSWORD: 'warehouse/account/password/change',

  //STOCK OPNAME
    STOCKOPNAME: "warehouse/stocks/opname",
    RECEIVE_PO: "warehouse/purchase-order-receive",
    PO_NUMBER: "warehouse/purchase-order-receive/purchase-order-detail",

  // STOCK
    STOCK: "warehouse/stocks",
    LOCATION_STOCK: "warehouse/stocks/locations",
    VARIANTS: "warehouse/variants",

  //HO ACCOUNT
    HO: 'ho/hos',
    HO_CREATE: 'ho/hos/create',

   // SALES EXTERNAL AREA 
    SALES_EXTERNAL: 'ho/armies',
    CREATE_SALES_EXTERNAL: 'ho/armies/create',
    CUSTOMER_SALES_EXTERNAL: 'ho/army-customers',

    SPV_ARMIES: 'ho/spv-armies',
    CREATE_SPV_ARMIES: 'ho/spv-armies/create',
    CUSTOMER_ARMIES: 'ho/army-customers',

    // DEALER AREA
    DEALER: 'ho/dealers',
    CREATE_DEALER: 'ho/dealers/create',

    // CARS AREA
    CARS: 'ho/car-models',
    CREATE_CARS: 'ho/car-models/create',
    BRANDS_CARS: 'ho/car-brands',

    //SITE AREA
    SITES: 'ho/sites',
    CREATE_SITES: 'ho/sites/create',
    STORE_LIST: 'ho/sites/store',
    WAREHOUSE_LIST: 'ho/sites/warehouse',
    STORE_WH_LIST: 'ho/sites/store-warehouse',

    //WAREHOUSE AREA
    WAREHOUSE: 'ho/warehouses',
    CREATE_WAREHOUSE: 'ho/warehouses/create',

    //CATEGORY
    CATEGORY: 'ho/categories',
    CREATE_CATEGORY: 'ho/categories/create',
    CATEGORIES: 'categories/tree',

    //PRODCTS
    PRODUCTS : 'ho/products',
    VARIANT_GENERATOR: 'ho/products/variant-generator',
    CREATE_PRODUCTS: 'ho/products/create',

    //SUPPLIER
    SUPPLIER : 'ho/suppliers',
    CREATE_SUPPLIER: 'ho/suppliers/create',

    //BUNDLE PRODUCTS
    BUNDLES : 'ho/bundles',
    CREATE_BUNDLES : 'ho/bundles/create',

    //SALES ARMY CONTENT
    ARMY_CONTENT: 'ho/army-contents',
    CREATE_ARMY_CONTENT: 'ho/army-contents/create',

    //ADMINISTRATIVE AREA PUBLIC
    GET_PROVINCE: 'administrative-area/provinces',
    GET_CITIES: 'administrative-area/cities',

    //PERMISSION AREA
    GET_PERMISSION : 'ho/roles/permission-list',
    ROLE : 'ho/roles',
    POST_ROLES: 'ho/hos'
  }
  
  export default ApiEndpoint
  