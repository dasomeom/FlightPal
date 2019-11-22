# -*- coding: utf-8 -*-
"""
Created on Thu Nov 21 19:11:42 2019

@author: tdussauge3
"""

from bs4 import BeautifulSoup
import urllib.request
import pandas as pd

callsign_opensky = pd.read_csv('test.csv')

columns = ['model', 'manufacturer_name', 'type_act']
act_info = pd.DataFrame(columns=columns, index=callsign_opensky.index)

count = 0

for index, row in callsign_opensky.iterrows():
    
    print(count)
    count+=1 
    
    N_number = str(row['callsign'])
    URL = "https://registry.faa.gov/aircraftinquiry/NNum_Results.aspx?NNumbertxt=" + N_number
    req = urllib.request.Request(URL)
    response = urllib.request.urlopen(req)
    html = response.read()
    
    # Parsing webpage and retrieve relevant info 
    soup = BeautifulSoup(html, 'html.parser')
    
    if(soup.find(id="ctl00_content_Label7") != None):
    
        model = soup.find(id="ctl00_content_Label7").string
        manufacturer_name = soup.find(id="ctl00_content_lbMfrName").string
        type_act = soup.find(id="ctl00_content_Label11").string
        
        act_info.loc[index] = [model, manufacturer_name, type_act]
    
new_callsign_opensky = pd.concat([callsign_opensky, act_info], axis=1)
new_callsign_opensky.to_csv('opensky_with_model.csv', index=None, header=True)