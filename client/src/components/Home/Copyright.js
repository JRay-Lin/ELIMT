import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

// !!! Copyright Content !!!
export default function Copyright() {
  return (
    <Typography variant="body2" align="center" color="#B4B4B4">
      {"Copyright © "}
      <Link color="#4096B6" href="https://github.com/JRay9487">
        CHUN-JUI, LIN
      </Link>{" "}
      {new Date().getFullYear()}. All Rights Reserved.
    </Typography>
  );
}
// !!! Copyright Content !!!