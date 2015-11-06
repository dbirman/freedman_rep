function [ signals, pcorrects ] = pullAndBin( pullfrom, jglData, signals, pcorrects )

diff = round(360/2/pi*abs(jglData.rot2 - jglData.rot1)*1000)/1000;
            diff = diff(pullfrom);

            binDiff = unique(diff);
            resp = jglData.responses(pullfrom);
            resp(resp==-1) = 0;
            resp = 1 - resp;
            binNM = {};
            for i = 1:length(binDiff)
                binNM{i} = resp(diff==binDiff(i));
            end

            sumCorr = cellfun(@sum,binNM);
            n = cellfun(@length,binNM);
            %             fit = fitweibull(binDiff,sumCorr,'ntotal',n,'gamma',0);
            %
            %             params = [params;fit.fitparams];
            signals = [signals;binDiff];
            pcorrects = [pcorrects;sumCorr./n];

