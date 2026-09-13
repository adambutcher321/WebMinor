import { permanentRedirect } from "next/navigation";

/* The sessions page grew into "Work with me"; old links still land. */
export default function SessionsRedirect() {
  permanentRedirect("/demo/mindful/work-with-me");
}
