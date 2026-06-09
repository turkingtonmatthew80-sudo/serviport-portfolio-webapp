import fs from 'fs';
import path from 'path';

const filesToProcess = [
  'src/pages/services/FletamentoMaritimoPage.tsx',
  'src/pages/services/OperacionesPortuariasPage.tsx',
  'src/pages/services/AlmacenajeResguardoPage.tsx',
  'src/pages/services/ServiciosBuquePage.tsx',
  'src/pages/services/AgenciamientoNavieroPage.tsx',
  'src/pages/services/TransporteMercanciasPage.tsx',
  'src/pages/about/CSRPage.tsx',
  'src/pages/about/CertificationsPage.tsx',
  'src/pages/about/CareersPage.tsx'
];

for (const file of filesToProcess) {
  let content = fs.readFileSync(file, 'utf8');

  // Regex to match the old hero section
  const heroRegex = /<section className="relative pt-24 pb-32 px-6 overflow-hidden min-h-\[500px\] flex flex-col justify-center">([\s\S]*?)<\/section>/;
  
  const match = content.match(heroRegex);
  if (match) {
    const heroContent = match[1];

    // Extracting parts
    const imgSrcMatch = heroContent.match(/<img src="([^"]+)"/);
    const linkMatch = heroContent.match(/<Link to="([^"]+)"/);
    const linkTextMatch = heroContent.match(/<Link[^>]+>([\s\S]*?)<\/Link>/);
    const tagMatch = heroContent.match(/<div className="inline-block px-4 py-2 bg-\[#[^\]]+\] text-white font-bold tracking-wider text-xs md:text-sm mb-4 uppercase rounded-sm">\s*([^<]+)\s*<\/div>/);
    const titleMatch = heroContent.match(/<h1 className="[^"]+">\s*([\s\S]*?)\s*<\/h1>/);
    const descMatch = heroContent.match(/<p className="[^"]+">\s*([\s\S]*?)\s*<\/p>/);

    const imgSrc = imgSrcMatch ? imgSrcMatch[1] : '';
    const linkTo = linkMatch ? linkMatch[1] : '';
    // Simplify link text extraction (it might contain ArrowRight)
    const linkTextFull = linkTextMatch ? linkTextMatch[1] : '';
    let linkLabel = linkTextFull.replace(/<ArrowRight[^>]+>\s*/, '').trim();
    if(linkLabel.includes('/>')) {
        linkLabel = linkLabel.split('/>')[1].trim();
    }
    
    const tag = tagMatch ? tagMatch[1].trim() : '';
    const title = titleMatch ? titleMatch[1].trim() : '';
    const desc = descMatch ? descMatch[1].trim() : '';
    
    const newHero = `
      <section className="bg-[#0b1a2e] text-white pt-24 pb-20 md:pb-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img src="${imgSrc}" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-[1260px] mx-auto relative z-10 text-center md:text-left">
          ${linkTo ? `<Link to="${linkTo}" className="inline-flex items-center gap-2 text-[#00A9CE] font-bold hover:text-white transition-colors uppercase tracking-wider text-xs mb-6 mx-auto md:mx-0">
            <ArrowRight size={16} className="rotate-180" /> ${linkLabel}
          </Link>
          <br/>` : ''}
          ${tag ? `<div className="inline-block px-2 py-1 bg-[#00A9CE] text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm">
            ${tag}
          </div>` : ''}
          <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-extrabold text-white leading-[1.1] mb-4 md:mb-6">
            ${title}
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed mx-auto md:mx-0">
            ${desc}
          </p>
        </div>
      </section>`.trim();

    content = content.replace(heroRegex, newHero);
    
    // Also, let's update some other padding classes just in case:
    content = content.replace(/className="py-24 px-6/g, 'className="py-12 md:py-16 lg:py-20 px-4 md:px-6 flex justify-center w-full');
    content = content.replace(/className="max-w-7xl mx-auto/g, 'className="max-w-[1260px] mx-auto w-full');

    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
