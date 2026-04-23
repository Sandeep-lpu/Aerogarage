import { servicesCatalog } from "../content/servicesCatalog";
import ServiceDetailTemplate from "../templates/ServiceDetailTemplate";

const service = servicesCatalog.find((item) => item.slug === "pbb-operations-maintenance");

export default function PbbOperationsPage() {
  return <ServiceDetailTemplate service={service} />;
}
