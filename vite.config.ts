import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig(({mode})=>{
  const base=mode==='pages'?'/OT-command-center/':'/';
  return {base,plugins:[react(),VitePWA({
    registerType:'prompt',includeAssets:['icon.svg'],
    manifest:{name:'OT Command Center',short_name:'OT Center',description:'School occupational therapy workspace',theme_color:'#156a60',background_color:'#f5f7f8',display:'standalone',start_url:base,scope:base,icons:[{src:`${base}icon-192.png`,sizes:'192x192',type:'image/png',purpose:'any'},{src:`${base}icon-512.png`,sizes:'512x512',type:'image/png',purpose:'any maskable'}]},
    workbox:{clientsClaim:true,globPatterns:['**/*.{js,css,html,svg,png,woff2}'],navigateFallback:`${base}index.html`}
  })]};
});
