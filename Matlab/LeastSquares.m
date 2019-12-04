clear all;
close all;


indextable = readtable('hourly_selected.csv');
[len, ~] = size(indextable);
x = zeros(365*24,6);
y = zeros(365*24, 1);
lastAirport = string(indextable(1,:).Var3);

coefFile = fopen('coef.csv','w');
fprintf(coefFile, "airport,monthCoef,dayCoef,hourCoef,month2Coef,day2Coef,hour2Coef\n");
rc = 1; %row count for the particular airport
lastapstart = 1;
figure;
legendStr = [];
airportCount = 0;
for i = 1:len
    thisAirport = string(indextable(i,:).Var3);
    
    if (lastAirport ~= thisAirport)
        % calculate the LS coefficients and dump to file for the last
        % airport
        thisX = x(1:rc,:);
        thisY = y(1:rc);
        thisA = (thisX' * thisX)\(thisX'*thisY);
        fprintf(coefFile, "%s,%f,%f,%f,%f,%f,%f\n", lastAirport, thisA(1), thisA(2), thisA(3), thisA(4), thisA(5), thisA(6));
        rc = 1;
        
        %reset x and y;
        x = zeros(365*24,3);
        y = zeros(365*24, 1);
        
        MSE = 0;
        for j = lastapstart:i-1
            modelCount = (thisA(1) * month(indextable(j,:).Var2)) + (thisA(2) * day(indextable(j,:).Var2)) + (thisA(2) * indextable(j,:).Var1);
            modelCount = modelCount + ((thisA(4) * (month(indextable(j,:).Var2))^2) + (thisA(5) * (day(indextable(j,:).Var2))^2) + (thisA(6) * (indextable(j,:).Var1)^2));
            error = abs(indextable(j,:).Var4 - modelCount);
            MSE = MSE + error^2;
        end
        RMSE = sqrt(MSE/(i-lastapstart));
        stem(airportCount, RMSE,'o'); hold on;
        legendStr = [legendStr lastAirport];
        airportCount = airportCount + 1;
        lastapstart = i;
    end
    
    x(rc,1) = month(indextable(i,:).Var2);
    x(rc,2) = day(indextable(i,:).Var2);
    x(rc,3) = indextable(i,:).Var1;
    x(rc,4) = x(rc,1)^2;
    x(rc,5) = x(rc,2)^2;
    x(rc,6) = x(rc,3)^2;
    
    y(rc) = indextable(i,:).Var4;

    if (i == len)
        thisX = x(1:rc,:);
        thisY = y(1:rc);
        thisA = (thisX' * thisX)\(thisX'*thisY);
        if (sum(isnan(thisA)) == 0)
            fprintf(coefFile, "%s,%f,%f,%f,%f,%f,%f\n", thisAirport, thisA(1), thisA(2), thisA(3), thisA(4), thisA(5), thisA(6));
        end
    end
    lastAirport = thisAirport;
    rc = rc + 1;
end

grid on;
legend(legendStr);
title("Root-Mean-Square Error(RMSE) of Least-Squares model for Selected Airports");


