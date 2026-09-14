import Site from "@/components/Site";

export default function Home() {
  return <Site year={new Date().getFullYear()} />;
}
