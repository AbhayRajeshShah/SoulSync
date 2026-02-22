import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Card } from "./ui/card";
export default function Contact() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <>
      <Card className="px-6">
        <div className="flex flex-col gap-4">
          <p className="text-lg">Schedule a 1:1 Meeting with Mentor</p>
          <button
            data-cal-namespace="30min"
            data-cal-link="aakarsh-purwar-zfbet7/30min"
            data-cal-config='{"layout":"month_view"}'
            className="bg-primary cursor-pointer py-4 x-2 rounded-md text-white"
          >
            Schedule Meeting
          </button>
        </div>
      </Card>
    </>
  );
}
