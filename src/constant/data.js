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
        childtitle: "Data Mobil",
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

  // {
  //   isHeadr: true,
  //   title: "Master Data Pengguna",
  //   isHide: true,
  // },

  //Menu Master Pengguna
  {
    title: "Pengguna",
    icon: "heroicons-outline:users",
    link: "/app/home",
    child: [
      {
        childtitle: "Admin SJM",
        childlink: "/users",
        childicon: "heroicons-outline:users",
      },
      {
        childtitle: "Role Admin SJM",
        childlink: "/permissions",
        childicon: "heroicons-outline:shield-exclamation",
      },
    ]
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
            m_childtitle: "Data Mobil",
            m_childlink: "/cars",
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
        megamenutitle: "Master Produk Sales",
        megamenuicon: "heroicons-outline:rectangle-group",
        singleMegamenu: [
        
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
        megamenutitle: "Master Cabang SJM",
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
        megamenutitle: "Master Dealer Sales",
        megamenuicon: "heroicons-outline:truck",
        singleMegamenu: [
          {
            m_childtitle: "Data Dealer Sales",
            m_childlink: "/dealers",
          },
        ],
      },
      {
        megamenutitle: "Master Sales",
        megamenuicon: "heroicons-outline:user-group",
        singleMegamenu: [
          {
            m_childtitle: "Data Sales Army",
            m_childlink: "/army",
          },
          {
            m_childtitle: "Data Sales Internal",
            m_childlink: "/coming-soon",
          },
        ],
      },
    ],
  },

  //Menu Master Pengguna
  {
    title: "Pengguna",
    icon: "heroicons-outline:chip",
    link: "/app/home",
    isHide: true,
    child: [
      {
        childtitle: "Admin SJM",
        link: "/users",
        childicon: "heroicons-outline:users",
      },
      {
        childtitle: "Role Admin SJM",
        link: "/permissions",
        childicon: "heroicons-outline:shield-exclamation",
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