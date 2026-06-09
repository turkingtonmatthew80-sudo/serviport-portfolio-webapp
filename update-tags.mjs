import fs from 'fs';

function updateFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/className="bg-\[#F7941D\] text-white text-\[10px\]/g, 'className="bg-[#00A9CE] text-white text-[10px]');
  content = content.replace(/className="absolute bottom-3 left-3 bg-\[#F7941D\] text-white text-\[10px\]/g, 'className="absolute bottom-3 left-3 bg-[#00A9CE] text-white text-[10px]');
  content = content.replace(/<span className="w-2 h-2 rounded-full bg-\[#F7941D\]"><\/span>/g, '<span className="w-2 h-2 rounded-full bg-[#00A9CE]"></span>');
  content = content.replace(/className="bg-orange-100 text-\[#F7941D\] text-\[10px\] font-bold uppercase px-2.5 py-1 rounded w-fit mb-4"/g, 'className="bg-[#00A9CE]/10 text-[#00A9CE] text-[10px] font-bold uppercase px-2.5 py-1 rounded w-fit mb-4"');
  fs.writeFileSync(file, content);
}

updateFile('src/pages/NewsPage.tsx');
updateFile('src/components/NewsSection.tsx');
updateFile('src/components/PartnersProjectsSection.tsx');
