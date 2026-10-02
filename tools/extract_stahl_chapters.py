import re, json, sys
S=sys.argv[1]
lines=open(S+'/stahl.txt',encoding='utf8').read().split('\n')
heads=["Brands","Generic?","Class","Commonly Prescribed for","How the Drug Works","How Long Until It Works","If It Works","If It Doesn’t Work","Tests","How Drug Causes Side Effects","Notable Side Effects","Life-Threatening or Dangerous Side Effects","Weight Gain","Sedation","What to Do About Side Effects","Best Augmenting Agents for Side Effects","Usual Dosage Range","Dosage Forms","How to Dose","Dosing Tips","Overdose","Long-Term Use","Habit Forming","How to Stop","Pharmacokinetics","Drug Interactions","Other Warnings/Precautions","Do Not Use","Renal Impairment","Hepatic Impairment","Cardiac Impairment","Elderly","Children and Adolescents","Pregnancy","Breast Feeding","Potential Advantages","Potential Disadvantages","Primary Target Symptoms","Pearls","Suggested Reading","Side Effects","Dosing and Use","Special Populations","The Art of Psychopharmacology","Therapeutics"]
starts=[i for i,l in enumerate(lines) if l.strip()=="Therapeutics" and i>500]
out={}
for k,s in enumerate(starts):
    name=None
    j=s-1
    while not lines[j].strip(): j-=1
    name=lines[j].strip()
    end=starts[k+1]-1 if k+1<len(starts) else len(lines)
    if k+1<len(starts):
        j=starts[k+1]-1
        while not lines[j].strip(): j-=1
        end=j
    sec={}; cur=None; buf=[]
    for l in lines[s+1:end]:
        t=l.strip()
        if t in heads:
            if cur: sec[cur]=sec.get(cur,'')+'\n'.join(buf)
            cur=t; buf=[]
        else: buf.append(t)
    if cur: sec[cur]='\n'.join(buf)
    clean={}
    for h,v in sec.items():
        v=re.sub(r'\n{2,}','\n\n',v).strip()
        paras=[re.sub(r'\s+',' ',p.replace('-\n','-').replace('\n',' ')).strip() for p in v.split('\n\n')]
        clean[h]=[p for p in paras if p]
    out[name]=clean
json.dump(out,open(S+'/stahl.json','w'),indent=1,ensure_ascii=False)
print(len(out)); print(list(out)[:200])
