%% Before this:

% download_datafiles
% run ./getData.bash
% makeAllMats
% matlab_behaviorMTurk -> convert to csv

%% Analysis
rmpath(genpath('~/proj/cohcon_mturk'));
global analysis
analysis.dir = '~/proj/freedman_rep/';

%%
append = '';
show = 1;
%% Run

names = {};

files = dir(sprintf('~/proj/freedman_rep/%smat/*.mat',append));

params = [];
signals = [];
pcorrects = [];
pcorrectstes = [];
for fi = 1:length(files)
    load(fullfile(sprintf('~/proj/freedman_rep/%smat',append),files(fi).name));
    
    if length(fields(jglData.postSurvey))>1
        csvf = fullfile(analysis.dir,sprintf('%scsv',append));
        if ~isdir(csvf), mkdir(csvf); end


        wid_i = strfind(files(fi).name,':');
        wid = files(fi).name(1:wid_i-1);
        csvf = fullfile(csvf,sprintf('data_%s.csv',wid));

        names{end+1} = wid;

        direct = strfind(append,'dir');
        if show
            disp('****************************');
            disp(sprintf('File: %s',files(fi).name));
            disp('****************************');
            %% print survey responses

            if isfield(jglData.postSurvey,'ruleknownDir')
                direct = 1;
                disp(sprintf('Knowledge of Dir Rule: %s',jglData.postSurvey.ruleDir));

                disp(sprintf('Post Explanation, did they know?: %s',jglData.postSurvey.ruleknownDir));
                %         disp(sprintf('Knowledge of Cat Rule: %s',jglData.postSurvey.ruleCat));
                %         disp(sprintf('Post Explanation, did they know?: %s',jglData.postSurvey.ruleknownCat));
            else
                disp(sprintf('Knowledge of Cat Rule: %s',jglData.postSurvey.ruleCat));
                disp(sprintf('Post Explanation, did they know?: %s',jglData.postSurvey.ruleknownCat));
            end
            disp(sprintf('Comments: %s',jglData.postSurvey.comments));
            disp(sprintf('Were they attending? (claimed): %s',jglData.postSurvey.attention));
            disp(sprintf('Were they fixating? (claimed): %s',jglData.postSurvey.fixation));
            disp(sprintf('Eye jitter / tracking? %s',jglData.postSurvey.motion));
            disp(sprintf('Screen Problems): %i',jglData.postSurvey.smoothness));
        end

        if direct > 0 

            pullfrom = 76:100;
            % add 'diff' field
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
            %             pcorrectstes = [pcorrectstes;fit.pcorrectste];

        end

        %% convert everything to CSV - output


        fieldz = {'responses','correct','direction','categories','match','rot1','rot2','known','trial','block'};

        data = zeros(length(jglData.responses),length(fieldz));
        for i = 1:length(fieldz)
            field = fieldz{i};

            data(:,i) = jglData.(fieldz{i});
        end

        csvwriteh(csvf,data,fieldz);

    end
end

%%

for ni = 1:length(names)
    disp(names{ni});
end

%% Testing weibull fit for dirs
% params = params(params(:,1)>0,:);
% params = params(params(:,1)<90,:);


pcknown = mean(pcorrects,1);
pcsteknown = sqrt(pcknown.*(1-pcknown)/size(pcorrects,1));

%%
figure, hold on
errorbar(binDiff,pcstart,pcstestart,'-g');
errorbar(binDiff,pcend,pcsteend,'-y');
errorbar(binDiff,pcknown,pcsteknown,'-r');
axis([0 70 0 1])

% x = 0:90;
% figure, hold on
% plot(x,weibull(x,avgparams));
plot([0,15,30,45,60,75],[0.05,.08,.22,.69,.9,.99],'-b');
legend('First 25 Trials','Last 25 Trials','Informed Task','Monkeys');
% legend('Humans','Monkeys');