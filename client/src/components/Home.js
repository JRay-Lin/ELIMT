import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

//頁面組件檔案
import Navigator from "./Home/Navigator";
import Content from "./Home/Content";
import Header from "./Home/Header";
import Copyright from "./Home/Copyright";

const drawerWidth = 256;

//創建主題
let theme = createTheme({
  palette: {
    primary: {
      light: "#46C5FF",
      main: "#67B2D4",
      dark: "#2e2e2e",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
    h6: {
      fontWeight: 480,
      fontSize: 20,
      letterSpacing: 0.4,
      color: "#FFFFFF",
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

//主題內容
theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        backgroundColor: "#161616",
        paper: {
          backgroundColor: "#141414",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root : {
          padding: "0"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          backgroundColor: theme.palette.primary.dark,
          color: "#ffffff",
          "&:hover": {
            backgroundColor: theme.palette.primary.main, 
          },
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up("md")]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          color: "#FFFFFF",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(255,255,255,0.15)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#4fc3f7",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
          color: "#ffffff",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "auto",
          marginRight: theme.spacing(2),
          "& svg": {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&.Mui-checked": {
            color: "#ffffff",
            "& .MuiSvgIcon-root": {
              color: "#ffffff",
              fill: "#ffffff",
            },
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
  },
};

//輸出畫面
export default function Home() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [activeItem, setActiveItem] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  const handleActiveItemChange = (item) => {
    setActiveItem(item);
    setTabIndex(0);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* 手機畫面 */}
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              onItemSelect={handleActiveItemChange}
            />
          )}

          {/* 電腦畫面 */}
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: "block", xs: "none" } }}
            onItemSelect={handleActiveItemChange}
          />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header
            onDrawerToggle={handleDrawerToggle}
            onTabChange={handleTabChange}
            activeItem={activeItem}
            tabIndex={tabIndex}
          />
          <Box
            component="main"
            sx={{ flex: 1, py: 6, px: 4, bgcolor: "#171717" }}
          >
            <Content activeItem={activeItem} tabIndex={tabIndex} />
          </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: "#171717" }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
