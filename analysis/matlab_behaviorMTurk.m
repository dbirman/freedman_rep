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
append = 'dir';
show = 0;
%% Run

names = {};

files = dir(sprintf('~/proj/freedman_rep/data/%smat/*.mat',append));

params = [];
signals = {[],[],[],[]};
pcorrects = {[],[],[],[]};
pullfroms = {1:25,26:50,51:75,75:100};
pcorrectstes = [];
ruleDir = {};
ruleCat = {};
adata = [];
for fi = 1:length(files)
    load(fullfile(sprintf('~/proj/freedman_rep/data/%smat',append),files(fi).name));
    
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
            if strcmp(append,'dir')
                disp(sprintf('WID: %i',fi));
            elseif strcmp(append,'cat')
                disp(sprintf('WID: %i',45+fi));
            else
                disp(sprintf('WID: %i',47+47+fi));
            end
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

            for pi = 1:length(pullfroms)
                pullfrom = pullfroms{pi};
                sig = signals{pi};
                pcorr = pcorrects{pi};
                [signals{pi}, pcorrects{pi}] = pullAndBin(pullfrom,jglData,sig,pcorr);
            end

                % add 'diff' field
            
            %             pcorrectstes = [pcorrectstes;fit.pcorrectste];

        end

        %% convert everything to CSV - output


        fieldz = {'responses','correct','direction','categories','match','rot1','rot2','known','trial','block'};

        data = zeros(length(jglData.responses),length(fieldz));
        for i = 1:length(fieldz)
            field = fieldz{i};

            data(:,i) = jglData.(fieldz{i});
        end
        adata = [adata;data];

%         csvwriteh(csvf,data,fieldz);

    end
end

%%

for ni = 1:length(names)
    disp(names{ni});
end

%%
  fsigm = @(param,xval) param(1)+(param(2)-param(1))./(1+10.^((param(3)-xval)*param(4)))

X = [repmat(pf(1),45,1);repmat(pf(2),45,1);repmat(pf(3),45,1);repmat(pf(4),45,1)];
est_params = sigm_fit(X,pcorrects{piG}(:));

%% Count how many of pcs are perfect
count = 0;
for i = 1:size(pcs,1)
    if pcs(i,1)==0 && pcs(i,2)==1
        count = count + 1;
    end
end

%% Compute sigmoid fit
adata = adata(adata(:,8)==0,:);    
adata = adata(adata(:,10)>1,:);
 ddiff = adata(:,6)-adata(:,7);
ddiff = abs(ddiff)/2/pi;
dresp = adata(:,1);
dresp(dresp==-1)=0;
dresp = 1-dresp;

fit = fitsigmoid(ddiff,dresp,[0 0 0 0],[1 1 1 1]);

plot(fit.fitx*360,fit.fity);

v = find(fit.fity>=.75,1);
fit.fitx(v)*360

%% Testing weibull fit for dirs

pi=3.1415927;
adiffs = round(360/2/pi*abs(jglData.rot2 - jglData.rot1)*1000)/1000;
pf = unique(adiffs);
piG = 3; % which pullfrom group

pc = mean(pcorrects{piG},1);
pcste = sqrt(pc.*(1-pc)/size(pcorrects{piG},1));

figure
errorbar(pf,pc,pcste,'-g');
hold on
% plot(0:100,fsigm(est_params,0:100))
plot(fit.fitx*360,fit.fity,'-y')
pcs = pcorrects{piG};
for si = 1:size(pcs,1)
    p = plot(pf,pcs(si,:),'-k');
%     alpha(p,.1)
end
% x = 0:90;
% figure, hold on
% plot(x,weibull(x,avgparams));
plot([0,15,30,45,60,75],[0.05,.08,.22,.69,.9,.99],'-b');
hold off
fullleg = {'First 25 Trials','25-50 Trials','50-75 Trials','Informed Task','Monkeys'};
legend(fullleg([piG 5]));
% legend('Humans','Monkeys');
axis([-5 80 -.05 1.05])