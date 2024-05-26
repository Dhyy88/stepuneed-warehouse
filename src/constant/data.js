export const menuItems = [
  {
    title: "Dashboard",
    icon: "heroicons-outline:home",
    isOpen: true,
    isHide: true,
    link: '/dashboard'
  },  
  
  //Menu Master Inventory
  {
    isHeadr: true,
    title: "Master Data SJM",
  },
  {
    title: "Master Produk",
    icon: "heroicons-outline:rectangle-group",
    link: "/app/home",
    child: [
      {
        childtitle: "Data Produk",
        childlink: "/products",
        multi_menu: [
          {
            multiTitle: "List Produk",
            multiLink: "products",
          },
          {
            multiTitle: "Tambah Produk",
            multiLink: "product/create",
          },
        ],
      },
      {
        childtitle: "Data Kategori",
        childlink: "/categories",
      },
      {
        childtitle: "Data Supplier",
        childlink: "/suppliers",
      },
    ]
  },
  {
    title: "Master Mobil",
    icon: "heroicons-outline:truck",
    link: "/app/home",
    child: [
      {
        childtitle: "Data Brand Mobil",
        childlink: "/brands"
      },  
      {
        childtitle: "Data Model Mobil",
        childlink: "/cars"
      },  
    ]
  },

  //Menu Master Cabang
  {
    title: "Master Cabang SJM",
    icon: "heroicons-outline:building-office-2",
    link: "/app/home",
    child: [
      {
        childtitle: "Data Cabang SJM",
        childlink: "/sites",
        isHide: false,
      },
      {
        childtitle: "Tambah Cabang SJM",
        childlink: "/site/create",
        // isHide: true,
      }
    ]
  },

  {
    title: "Master PO",
    icon: "heroicons-outline:clipboard-document-list",
    link: "/app/home",
    child: [
      {
        childtitle: "Data Permintaan PO",
        childlink: "/pobyme"
      },  
      {
        childtitle: "Data Persetujuan PO",
        childlink: "/poapprove"
      },  
      {
        childtitle: "Tambah PO",
        childlink: "/po/create"
      },  
    ]
  },

  //Menu Master Dealer

  {
    isHeadr: true,
    title: "Master Data Sales",
  },

  {
    title: "Master Produk",
    icon: "heroicons-outline:rectangle-group",
    link: "/app/home",
    child: [
      {
        childtitle: "Data Bundle Produk",
        childlink: "/bundles",
        isHide: false,
      },
      {
        childtitle: "Data Konten Army",
        childlink: "/contents/army",
        // isHide: true,
      }
    ]
  },

  //Menu Master Sales
  {
    title: "Sales",
    icon: "heroicons-outline:user-group",
    link: "/app/home",
    child: [
      {
        childtitle: "Sales Army",
        childlink: "/army",
      },
      {
        childtitle: "SPV Sales Army",
        childlink: "/spvarmy",
      },
      {
        childtitle: "Customer Sales Army",
        childlink: "/customerarmy",
      },
      {
        childtitle: "Sales Internal",
        childlink: "/coming-soon"
      }
    ]
  },

  {
    title: "Master Dealer Sales",
    icon: "heroicons-outline:truck",
    link: "/dealers",
  },

  {
    isHeadr: true,
    title: "Master Pengguna SJM",
    isHide: true,
  },

  //Menu Master Pengguna
  {
    title: "Admin Office",
    icon: "heroicons-outline:users",
    link: "/app/home",
    child: [
      {
        childtitle: "Admin Office",
        childlink: "/users",
        childicon: "heroicons-outline:users",
      },
      {
        childtitle: "Role Admin Office",
        childlink: "/permissions",
        childicon: "heroicons-outline:shield-exclamation",
      },
    ]
  },
  {
    title: "Admin Warehouse",
    icon: "heroicons-outline:users",
    link: "/app/home",
    child: [
      {
        childtitle: "Admin Warehouse",
        childlink: "/warehouse",
        childicon: "heroicons-outline:users",
      },
      {
        childtitle: "Admin SPV Warehouse",
        childlink: "/warehousespv",
        childicon: "heroicons-outline:users",
      },
    ]
  },

  {
    isHeadr: true,
    title: "Laporan SJM",
  },

  {
    title: "Laporan PO",
    icon: "heroicons-outline:clipboard-document",
    isOpen: true,
    isHide: true,
    link: '/poreport'
  },  
  {
    title: "Laporan Stock Opname",
    icon: "heroicons-outline:clipboard-document",
    isOpen: true,
    isHide: true,
    link: '/soreport'
  },  
];

export const topMenu = [

  // Menu Dashboard
  {
    title: "Dashboard",
    icon: "heroicons-outline:home",
    link: "dashboard",
  },

  {
    title: "Master Data",
    icon: "heroicons-outline:view-boards",
    link: "/app/home",
    megamenu: [
      {
        megamenutitle: "Master Produk SJM",
        megamenuicon: "heroicons-outline:rectangle-group",
        singleMegamenu: [
          {
            m_childtitle: "Data Brand Mobil",
            m_childlink: "/brands",
          },
          {
            m_childtitle: "Data Model Mobil",
            m_childlink: "/cars",
          },
          {
            m_childtitle: "Data Supplier",
            m_childlink: "/suppliers",
          },
          {
            m_childtitle: "Data Kategori",
            m_childlink: "/categories",
          },
          {
            m_childtitle: "Data Produk",
            m_childlink: "/products",
          },
        ],
      },
      {
        megamenutitle: "Master Divisi SJM",
        megamenuicon: "heroicons-outline:building-office-2",
        singleMegamenu: [
          {
            m_childtitle: "Data Cabang SJM",
            m_childlink: "/sites",
          },
          {
            m_childtitle: "Tambah Cabang SJM",
            m_childlink: "/site/create",
          },
          
        ],
      },
      
      {
        megamenutitle: "Master Data Sales",
        megamenuicon: "heroicons-outline:rectangle-group",
        singleMegamenu: [
          {
            m_childtitle: "Data Dealer Sales",
            m_childlink: "/dealers",
          },
          {
            m_childtitle: "Data Bundle Produk",
            m_childlink: "/bundles",
          },
          {
            m_childtitle: "Data Konten Army",
            m_childlink: "/contents/army",
          },
        ],
      },
      {
        megamenutitle: "Master Pengguna Sales Army",
        megamenuicon: "heroicons-outline:user-group",
        singleMegamenu: [
          {
            m_childtitle: "Data Sales Army",
            m_childlink: "/army",
          },
          {
            m_childtitle: "Data Sales SPV Army ",
            m_childlink: "/spvarmy",
          },
          {
            m_childtitle: "Data Customer Sales Army ",
            m_childlink: "/customerarmy",
          },
        ],
      },
      {
        megamenutitle: "Master Pengguna SJM",
        megamenuicon: "heroicons-outline:user-group",
        singleMegamenu: [
          {
            m_childtitle: "Data Sales Internal",
            m_childlink: "/coming-soon",
          },
        ],
      },
    ],
  },

  // Master PO

  {
    title: "Master PO",
    icon: "heroicons-outline:clipboard-document-list",
    link: "/app/home",
    isHide: true,
    child: [
      {
        childtitle: "Data Permintaan PO",
        link: "/pobyme",
        childicon: "heroicons-outline:folder-arrow-down",
      },
      {
        childtitle: "Data Persetujuan PO",
        link: "/poapprove",
        childicon: "heroicons-outline:document-check",
      },
      {
        childtitle: "Tambah PO",
        link: "/po/create",
        childicon: "heroicons-outline:plus-circle",
      },
    ],
  },

  //Menu Master Pengguna

  {
    title: "Pengguna SJM",
    icon: "heroicons-outline:chip",
    link: "/app/home",
    isHide: true,
    child: [
      {
        childtitle: "Admin Warehouse",
        link: "/warehouse",
        childicon: "heroicons-outline:user",
      },
      {
        childtitle: "Admin SPV Warehouse",
        link: "/warehousespv",
        childicon: "heroicons-outline:user-circle",
      },
      {
        childtitle: "Admin Office",
        link: "/users",
        childicon: "heroicons-outline:users",
      },
      {
        childtitle: "Role Admin Office",
        link: "/permissions",
        childicon: "heroicons-outline:shield-exclamation",
      },
    ],
  },

  //Master Report

  {
    title: "Laporan",
    icon: "heroicons-outline:information-circle",
    link: "/app/home",
    isHide: true,
    child: [
      {
        childtitle: "Laporan PO",
        link: "/poreport",
        childicon: "heroicons-outline:clipboard-document",
      },
      {
        childtitle: "Laporan Stok Opname",
        link: "/soreport",
        childicon: "heroicons-outline:clipboard-document",
      },
    ],
  },
  
];

// import User1 from "@/assets/images/all-img/user.png";
// export const notifications = [
//   {
//     title: "Your order is placed",
//     desc: "Amet minim mollit non deser unt ullamco est sit aliqua.",

//     image: User1,
//     link: "#",
//   },
// ];

export const colors = {
  primary: "#4669FA",
  secondary: "#A0AEC0",
  danger: "#F1595C",
  black: "#111112",
  warning: "#FA916B",
  info: "#0CE7FA",
  light: "#425466",
  success: "#50C793",
  "gray-f7": "#F7F8FC",
  dark: "#1E293B",
  "dark-gray": "#0F172A",
  gray: "#68768A",
  gray2: "#EEF1F9",
  "dark-light": "#CBD5E1",
};

// export const hexToRGB = (hex, alpha) => {
//   var r = parseInt(hex.slice(1, 3), 16),
//     g = parseInt(hex.slice(3, 5), 16),
//     b = parseInt(hex.slice(5, 7), 16);

//   if (alpha) {
//     return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
//   } else {
//     return "rgb(" + r + ", " + g + ", " + b + ")";
//   }
// };



// BACKUP MENU

  //Menu Master Inventory 
  // {
  //   title: "POS",
  //   icon: "heroicons-outline:rectangle-group",
  //   link: "/app/home",
  //   child: [
  //     {
  //       childtitle: "Data Produk",
  //       link: "/products",
  //     },
  //     {
  //       childtitle: "Data Kategori",
  //       link: "/categories"
  //     },
  //     {
  //       childtitle: "Data Mobil",
  //       link: "/cars"
  //     }
  //   ]
  // },

  // //Menu Master Cabang 
  // {
  //   title: "Master Cabang",
  //   icon: "heroicons-outline:building-office-2",
  //   link: "/app/home",
  //   child: [
  //     {
  //       childtitle: "Data Cabang",
  //       link: "/sites",
  //     },
  //     {
  //       childtitle: "Tambah Cabang",
  //       link: "/sites/create",
  //     },
  //   ]
  // },

  // //Menu Master Dealer 
  // {
  //   title: "Master Dealer",
  //   icon: "heroicons-outline:truck",
  //   link: "/dealers",
  // },

  // // Menu Master Sales
  // {
  //   title: "Master Sales",
  //   icon: "heroicons-outline:user-group",
  //   link: "/app/home",
  //   child: [
  //     {
  //       childtitle: "Sales Army",
  //       link: "/army",
  //     },
  //     {
  //       childtitle: "Sales Internal",
  //       link: "/coming-soon"
  //       // link: "/salesInternal"
  //     }
  //   ]
  // },