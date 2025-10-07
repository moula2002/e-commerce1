// src/redux/footerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sections: [
    {
      title: "Get to Know Us",
      links: ["About Amazon", "Careers", "Press Releases", "Amazon Science"]
    },
    {
      title: "Connect with Us",
      links: ["Facebook", "Twitter", "Instagram"]
    },
    {
      title: "Make Money with Us",
      links: [
        "Sell on Amazon",
        "Sell under Amazon Accelerator",
        "Protect and Build Your Brand",
        "Amazon Global Selling",
        "Supply to Amazon",
        "Become an Affiliate",
        "Fulfilment by Amazon",
        "Advertise Your Products",
        "Amazon Pay on Merchants"
      ]
    },
    {
      title: "Let Us Help You",
      links: [
        "Your Account",
        "Returns Centre",
        "Recalls and Product Safety Alerts",
        "100% Purchase Protection",
        "Amazon App Download",
        "Help"
      ]
    }
  ]
};

const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {}
});

export default footerSlice.reducer;
