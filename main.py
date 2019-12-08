import logging
import datetime, warnings, scipy
import pandas as pd
import pickle
import numpy as np
import seaborn as sns
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.patches as patches
from matplotlib.patches import ConnectionPatch
from collections import OrderedDict
from matplotlib.gridspec import GridSpec
from sklearn.linear_model import Ridge
from sklearn import metrics, linear_model
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.model_selection import train_test_split, cross_val_score, cross_val_predict
from scipy.optimize import curve_fit
plt.rcParams["patch.force_edgecolor"] = True
plt.style.use('fivethirtyeight')
mpl.rc('patch', edgecolor = 'dimgray', linewidth=1)
from IPython.core.interactiveshell import InteractiveShell
InteractiveShell.ast_node_interactivity = "last_expr"
pd.options.display.max_columns = 50

from flask import Flask, request, render_template, redirect, url_for, flash, session, Markup
from werkzeug.security import generate_password_hash, check_password_hash
import ast
import datetime

logging.basicConfig(level=logging.DEBUG)

def test_input(airline, depart_airport, arrive_airport, dep_at):
    dep_val = int(dep_at/100)*60+(dep_at%100)
    user_input = [[dep_val, airports_dict[depart_airport], airports_dict[arrive_airport], dep_at]]
    df = pd.DataFrame(user_input, columns = ['DEP_VALUE', 'ORIGIN_AIRPORT', 'DEST_AIRPORT', 'DEP_TIME'])
    X = np.array(testset[['ORIGIN_AIRPORT', 'DEP_VALUE', 'DEST_AIRPORT']])
    filename = airline.lower() + '_model.sav'
    return X, filename

def connect_model(filename, test_data):

    with open('/delay/' + filename, "rb") as f:
        print(f)
        loaded_poly, loaded_ridge = pickle.load(f)
    f.close()
    new_x = loaded_poly.fit_transform(test_data)
    score = loaded_ridge.predict(new_x)[0][0]
    return str('Expected Flight Delay is {:.2f} minutes'.format(np.sqrt(score)))


app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('delay.html')


@app.route('/', methods=['POST'])
def getDelay():
    print("aaaa")
    print(request.form['depAirport'])
    sys.stdout.flush()
    if request.method == 'POST':
        print(request.form['depAirport'])
        st.form['depAirport']
        print(depart_airport)
        arrive_airport = request.form['arrAirport']
        arrive_airport = arrive_airport.split(",")[0]
        dep_at = request.form['delayTime']
        airline = request.form['airlines']
        test_data, filename = test_input(airline, depart_airport, arrive_airport, dep_at)
        ans = connect_model(filename, test_data)
    return ans


if __name__ == '__main__':
    app.debug=True
    app.run()