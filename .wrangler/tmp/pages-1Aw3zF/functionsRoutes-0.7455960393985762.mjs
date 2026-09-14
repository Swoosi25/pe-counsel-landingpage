import { onRequestPost as __api_waitlist_js_onRequestPost } from "C:\\Users\\stone\\Documents\\PE Counsel PRE-Launch Landingpage\\functions\\api\\waitlist.js"
import { onRequestPost as __complete_js_onRequestPost } from "C:\\Users\\stone\\Documents\\PE Counsel PRE-Launch Landingpage\\functions\\complete.js"
import { onRequestGet as __verify_js_onRequestGet } from "C:\\Users\\stone\\Documents\\PE Counsel PRE-Launch Landingpage\\functions\\verify.js"

export const routes = [
    {
      routePath: "/api/waitlist",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_waitlist_js_onRequestPost],
    },
  {
      routePath: "/complete",
      mountPath: "/",
      method: "POST",
      middlewares: [],
      modules: [__complete_js_onRequestPost],
    },
  {
      routePath: "/verify",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__verify_js_onRequestGet],
    },
  ]