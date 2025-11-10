"use client";
import { useMemo, useState } from "react";

const WHATSAPP_LINK = "https://wa.me/51999999999?text=Hola%20soy%20agente%20y%20quiero%20acceso%20a%20Vistavia"; // TODO: tu WhatsApp
const YAPE_LINK = "#"; // TODO: tu link/QR (opcional)

const VistaviaMark = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" aria-label="Vistavia mark">
    <path d="M18 24h18c2.5 0 4.9 1.2 6.3 3.3L48 41l5.7-13.7c1.4-2.1 3.8-3.3 6.3-3.3H78c2.7 0 4.4 2.8 3.2 5.2L52.8 78.3c-2.2 4.2-7.9 4.2-10.1 0L14.8 29.2C13.6 26.8 15.3 24 18 24z" fill="#4F46E5"/>
    <circle cx="48" cy="44" r="6" fill="#FFFFFF"/>
  </svg>
);

const DISTRICTS = ["Miraflores","Surco","San Isidro","Barranco","La Molina"] as const;
const TYPES = ["Departamento","Casa","Oficina","Local"] as const;

type Listing = {
  id:number; title:string; priceUSD:number; district:string; type:string; m2:number; status:"Exclusivo"|"50/50"; coords:[number,number];
};

const DUMMY_LISTINGS: Listing[] = [
  { id:1, title:"Miraflores — 93 m² — 3D/3B", priceUSD:180000, district:"Miraflores", type:"Departamento", m2:93, status:"Exclusivo", coords:[-12.122,-77.03]},
  { id:2, title:"Surco — 120 m² — 3D/2B", priceUSD:165000, district:"Surco", type:"Departamento", m2:120, status:"50/50", coords:[-12.15,-77.01]},
  { id:3, title:"San Isidro — Oficina 80 m²", priceUSD:210000, district:"San Isidro", type:"Oficina", m2:80, status:"Exclusivo", coords:[-12.10,-77.04]},
  { id:4, title:"Barranco — 65 m² — 2D/1B", priceUSD:135000, district:"Barranco", type:"Departamento", m2:65, status:"50/50", coords:[-12.147,-77.02]},
  { id:5, title:"La Molina — Casa 240 m²", priceUSD:320000, district:"La Molina", type:"Casa", m2:240, status:"Exclusivo", coords:[-12.082,-76.95]},
];

export default function Page() {
  const [route, setRoute] = useState<"explore"|"detail"|"pricing">("explore");
  const [active, setActive] = useState<Listing>(DUMMY_LISTINGS[0]);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onNavigate={setRoute} />
      {route==="explore" && <Explore onOpen={(l)=>{setActive(l);setRoute("detail");}} onGoPricing={()=>setRoute("pricing")} />}
      {route==="detail"  && active && <Detail listing={active} onBack={()=>setRoute("explore")} onGoPricing={()=>setRoute("pricing")} />}
      {route==="pricing" && <Pricing onBack={()=>setRoute("explore")} />}
      <Footer />
    </div>
  );
}

function Header({ onNavigate }:{ onNavigate:(r:"explore"|"detail"|"pricing")=>void }){
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VistaviaMark />
          <div className="leading-tight">
            <div className="font-semibold">Vistavia</div>
            <div className="text-xs text-slate-500 font-semibold tracking-wide">Red Inmobiliaria</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <button onClick={()=>onNavigate("explore")} className="hover:text-slate-900">Explorar</button>
          <a href="#como-funciona" className="hover:text-slate-900">Cómo funciona</a>
          <button onClick={()=>onNavigate("pricing")} className="hover:text-slate-900">Precios</button>
        </nav>
        <a className="inline-flex items-center px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:opacity-90" href={WHATSAPP_LINK}>Solicitar acceso</a>
      </div>
    </header>
  );
}

function Explore({ onOpen, onGoPricing }:{ onOpen:(l:Listing)=>void; onGoPricing:()=>void }){
  const [district, setDistrict] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  const filtered = useMemo(()=>{
    return DUMMY_LISTINGS.filter(l =>
      (!district || l.district===district) &&
      (!type || l.type===type) &&
      (!price || l.priceUSD <= price)
    );
  },[district,type,price]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="grid md:grid-cols-3 gap-6 items-start">

        <div className="md:col-span-1 rounded-2xl border border-slate-200 bg-white">
          <div className="p-4 border-b border-slate-100"><div className="text-sm font-semibold">Filtros (demo)</div></div>
          <div className="p-4 space-y-3">
            <div>
              <label className="text-xs text-slate-500">Distrito</label>
              <select value={district} onChange={e=>setDistrict(e.target.value)} className="w-full mt-1 rounded-xl border-slate-200">
                <option value="">Todos</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Tipo</label>
              <select value={type} onChange={e=>setType(e.target.value)} className="w-full mt-1 rounded-xl border-slate-200">
                <option value="">Todos</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Precio máx. (USD)</label>
              <input type="number" placeholder="Ej. 200000" value={price or ''} onChange={e=>setPrice(Number(e.target.value or 0))} className="w-full mt-1 rounded-xl border-slate-200"/>
            </div>
            <div className="text-xs text-slate-500">* Filtros demo (sin backend)</div>
            <button onClick={onGoPricing} className="w-full rounded-xl border border-slate-200 py-2 hover:bg-slate-50">Ver planes</button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {filtered.map((l)=> (
                <div key={l.id} className="rounded-xl overflow-hidden border border-slate-200 bg-white cursor-pointer" onClick={()=>onOpen(l)}>
                  <div className="h-28 bg-slate-100"/>
                  <div className="py-3 px-4 flex items-center justify-between text-sm">
                    <span>{l.title}</span>
                    <span className="text-indigo-600 font-bold">USD {new Intl.NumberFormat().format(l.priceUSD)}</span>
                  </div>
                </div>
              ))}
              {filtered.length===0 && <div className="text-sm text-slate-500">Sin resultados con esos filtros.</div>}
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
              <div className="px-3 py-2 text-sm flex items-center justify-between bg-white border-b border-slate-100">
                <div className="font-medium">Mapa (demo)</div>
                <div className="text-slate-500 text-xs">Mapa | Sat.</div>
              </div>
              <div className="h-80 bg-gradient-to-br from-slate-100 to-slate-200 relative">
                {filtered.slice(0,6).map((l, idx)=> (
                  <div key={l.id} className="absolute" style={{ top: `${10 + idx*8}%`, left: `${15 + (idx%3)*20}%` }}>
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                      USD {Math.round(l.priceUSD/1000)}k
                    </span>
                  </div>
                ))}
                <div className="absolute bottom-3 right-3">
                  <button className="rounded-xl text-xs border border-slate-200 bg-white/80 px-3 py-2 hover:bg-white">Buscar en esta área</button>
                </div>
              </div>
            </div>
          </div>

          <div id="como-funciona" className="grid md:grid-cols-3 gap-4">
            <Step n={1} title="Comparte inventario" desc="Publica tus fichas con plantilla estandarizada y reglas claras (colaboración)." />
            <Step n={2} title="Filtra por zona y precio" desc="Encuentra matches entre agentes en minutos con catálogo + mapa." />
            <Step n={3} title="Leads con atribución" desc="Recibe consultas con sello de origen. Sin comisiones por cierre." />
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ listing, onBack, onGoPricing }:{ listing:Listing; onBack:()=>void; onGoPricing:()=>void }){
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="text-sm text-slate-600 flex items-center gap-2 mb-4 hover:text-slate-900">← Volver</button>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="h-72 bg-slate-100"/>
          <div className="p-4 text-sm text-slate-600">Galería de imágenes (demo).</div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <div className="mt-1 text-indigo-600 font-extrabold text-xl">USD {new Intl.NumberFormat().format(listing.priceUSD)}</div>
          <div className="mt-3 text-sm text-slate-600">{listing.type} — {listing.m2} m² — {listing.district}</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>Condiciones visibles para colaboración</li>
            <li>Publicación verificada</li>
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href={WHATSAPP_LINK} className="rounded-xl w-full text-center px-4 py-2 bg-indigo-600 text-white hover:opacity-90">Contactar</a>
            <button onClick={onGoPricing} className="rounded-xl w-full border border-slate-200 px-4 py-2 hover:bg-slate-50">Ver planes</button>
          </div>

          <div className="mt-6 text-xs text-slate-500">* Demo: los datos son ficticios. La versión real requiere verificación de agente.</div>
        </div>
      </div>
    </section>
  );
}

function Pricing({ onBack }:{ onBack:()=>void }){
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={onBack} className="text-sm text-slate-600 flex items-center gap-2 mb-6 hover:text-slate-900">← Volver</button>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Planes para agentes</h2>
        <p className="text-slate-600 mt-2">Sin comisión por cierre. Leads con atribución. Cancela cuando quieras.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="font-semibold">Vistavia (Agentes)</div>
          <div className="text-4xl font-extrabold mt-2">S/49<span className="text-base font-semibold text-slate-500"> / mes</span></div>
          <ul className="mt-4 space-y-2 text-slate-700 text-sm">
            <li>Catálogo + mapa (entre agentes)</li>
            <li>Reglas claras (exclusivos, colaboración)</li>
            <li>Mensajería y alertas</li>
            <li>Sin comisión de plataforma</li>
          </ul>
          <div className="mt-6"><a href={WHATSAPP_LINK} className="rounded-xl w-full text-center px-4 py-2 bg-indigo-600 text-white hover:opacity-90 inline-block">Solicitar acceso</a></div>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-white p-6">
          <div className="font-semibold">+Exposición (opt‑in B2C futuro)</div>
          <div className="text-4xl font-extrabold mt-2">+ S/24.5<span className="text-base font-semibold text-slate-500"> / mes</span></div>
          <ul className="mt-4 space-y-2 text-slate-700 text-sm">
            <li>Fichas públicas opt‑in por propiedad</li>
            <li>1 Destacado/semana incluido</li>
            <li>Pedidos de clientes (beta)</li>
            <li>Reporte básico de vistas/clics</li>
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href={WHATSAPP_LINK} className="rounded-xl w-full text-center px-4 py-2 bg-indigo-600 text-white hover:opacity-90">Hablar ahora</a>
            <a href={YAPE_LINK} className="rounded-xl w-full text-center px-4 py-2 border border-slate-200 hover:bg-slate-50">Reservar cupo (Yape)</a>
          </div>
          <div className="text-xs text-slate-500 mt-3">La facturación del add‑on inicia al habilitar el portal público.</div>
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-4">
        <Faq q="¿Cobran comisión por cierre?" a="No. Ingresos solo por membresía y add‑ons. El lead siempre se atribuye al agente publicador (y co‑broker si aplica)." />
        <Faq q="¿La ubicación es exacta?" a="Obfuscada por defecto. Datos sensibles visibles solo entre agentes o si el agente lo autoriza para público." />
        <Faq q="¿Puedo apagar la exposición pública?" a="Sí, el opt‑in es por ficha y reversible en cualquier momento." />
      </div>
    </section>
  );
}

function Step({ n, title, desc }:{ n:number; title:string; desc:string }){
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-900 text-white grid place-items-center text-sm font-semibold">{n}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <div className="mt-2 text-sm text-slate-600">{desc}</div>
    </div>
  );
}

function Faq({ q, a }:{ q:string; a:string }){
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-base font-semibold">{q}</div>
      <div className="text-sm text-slate-600 mt-1">{a}</div>
    </div>
  );
}

function Footer(){
  return (
    <footer className="py-10 border-t border-slate-100 bg-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6 items-start">
        <div>
          <div className="flex items-center gap-2">
            <VistaviaMark />
            <div className="leading-tight">
              <div className="font-semibold">Vistavia</div>
              <div className="text-xs text-slate-500 font-semibold tracking-wide">Red Inmobiliaria</div>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-3">Red profesional de agentes. Catálogo, mapa y datos. Sin comisiones por cierre.</p>
        </div>
        <div className="text-sm text-slate-600">
          <div className="font-semibold mb-2">Recursos</div>
          <ul className="space-y-1">
            <li>Mapa y catálogo (demo)</li>
            <li>Términos y Privacidad (próx.)</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">¿Listo para cerrar más?</div>
          <a href={WHATSAPP_LINK} className="inline-block rounded-2xl px-4 py-2 bg-indigo-600 text-white hover:opacity-90">Solicitar acceso</a>
          <p className="text-xs text-slate-500 mt-2">Respuesta usual &lt; 15 min (horario laboral).</p>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-slate-400">© {{"{"}}new Date().getFullYear(){{"}"}} Vistavia. Todos los derechos reservados.</div>
    </footer>
  );
}
