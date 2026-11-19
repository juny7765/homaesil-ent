import Link from "next/link";
import { Header, Footer } from "@/components/chrome";
export default function NotFound() {
  return (<><Header /><main><section className="section"><div className="wrap stack"><h1 className="h1">페이지를 찾을 수 없습니다</h1><p className="lead">주소가 바뀌었거나 삭제된 페이지입니다.</p><div className="actions"><Link className="btn p" href="/">홈으로</Link><Link className="btn s" href="/visit/">진료·방문안내</Link></div></div></section></main><Footer /></>);
}
