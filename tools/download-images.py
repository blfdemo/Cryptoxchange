import os, urllib.request
# Run once with internet: python tools/download-images.py
d=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","assets","img","photos")
os.makedirs(d,exist_ok=True)
m={'1639754391037-98dd3cb74e09': 'chart', '1768055104929-cf2317674a80': 'trader', '1635236198091-33d5aa8466cc': 'laptop', '1764193875922-9c7df90a44cc': 'towers', '1767187571489-e2499f056f74': 'skyline'}
for k,v in m.items():
    u=f"https://images.unsplash.com/photo-{k}?auto=format&fit=crop&w=1400&q=70"
    req=urllib.request.Request(u,headers={"User-Agent":"Mozilla/5.0"})
    open(os.path.join(d,v+".jpg"),"wb").write(urllib.request.urlopen(req).read()); print("saved",v)
