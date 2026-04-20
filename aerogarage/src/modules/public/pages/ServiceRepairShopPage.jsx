import { servicesCatalog } from "../content/servicesCatalog";
import ServiceDetailTemplate from "../templates/ServiceDetailTemplate";

const service = servicesCatalog.find((item) => item.slug === "repair-shop");

export default function RepairShopPage() {
  return <ServiceDetailTemplate service={service} />;
}
