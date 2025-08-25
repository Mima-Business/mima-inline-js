import { createModal, setBodyContent } from "../ui/modal";
import { spinner } from "../ui/spinner";
import { createSubscriptionSession } from "./api";
import { ce } from "./utils";

export async function createSubscription({
  baseUrl,
  path,
  payload,
  onClose,
  onSuccess,
}) {
  let subscription;

  const modal = createModal({ onClose });

  modal.open();

  // Loading state
  const loadNode = ce("div", "mima-center");
  loadNode.appendChild(spinner(75));
  setBodyContent(modal, loadNode);

  modal.close();
  try {
    subscription = await createSubscriptionSession({
      baseUrl,
      path,
      payload,
    });

    onSuccess();
    console.log("subscription", subscription);
  } catch (e) {
    modal.open();
    const err = ce("div", "mima-error");
    err.textContent = e.message;
    setBodyContent(modal, err);
    return;
  }
}
