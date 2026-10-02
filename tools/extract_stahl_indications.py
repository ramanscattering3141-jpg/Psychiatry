import re,json,html,sys
S=sys.argv[1]
L=open(S+'/stahl.html',encoding='utf8').read().split('\n')
idx=[i for i,l in enumerate(L) if '<b>Commonly Prescribed for</b>' in l]
names=list(json.load(open(S+'/stahl.json')))
print(len(idx),len(names))
out={}
for n,i in zip(names,idx):
    items=[]
    for l in L[i+1:i+40]:
        if 'How the Drug Works' in l: break
        if l.startswith('<hr'): continue
        l=re.sub(r'^<a name=\d+></a>','',l)
        if 'bold for FDA' in l: continue
        bold=l.startswith('<b>')
        t=html.unescape(re.sub(r'<[^>]+>',' ',l)); t=re.sub(r'\s+',' ',t).strip()
        if not t: continue
        if items and (t[0].islower() or t[0] in '(') and not bold==items[-1]['fda']==False and False: pass
        items.append({'t':t,'fda':bold})
    out[n]=items
json.dump(out,open(S+'/ind.json','w'),indent=1,ensure_ascii=False)
for k in ['Mirtazapine','Quetiapine','Clozapine','Lithium','Bupropion']: print(k,out[k])
