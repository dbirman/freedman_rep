%% getLongSurvey
% Grabs the individual data for each of the survey questions and converts
% to a long-form dataset (stored in cell arrays because Strings in
% Matlab...)

%% Before this:

% see matlab_behaviorMTurk
% longmat/dirmat/catmat should all be filled with the datafiles

%% Analysis
rmpath(genpath('~/proj/cohcon_mturk'));
global analysis
analysis.dir = '~/proj/freedman_rep/';

%%
appends = {'dir','cat','long'};

for ai = 1:length(appends)
    append = appends{ai};
    %% data we're going to collect
    
    dataOut = struct;
    demoFields = {'age','gender'};
    psFields = {'ruleDir','ruleKnownDir','ruleCat','ruleKnownCat','smoothness','attention','fixation','motion','before','comments'};
    
    for di = 1:length(demoFields)
        cd = demoFields{di};
        comm = sprintf('%s = {};',cd);
        eval(comm);
        aname = sprintf('a%s',cd);
        if ~exist(aname), comm = sprintf('%s = {};',aname); eval(comm); end
    end
    for di = 1:length(psFields)
        cd = psFields{di};
        comm = sprintf('%s = {};',cd);
        eval(comm);
        aname = sprintf('a%s',cd);
        if ~exist(aname), comm = sprintf('%s = {};',aname); eval(comm); end
    end
    %% Run
    
    names = {};
    
    files = dir(sprintf('~/proj/freedman_rep/data/%smat/*.mat',append));
    
    for fi = 1:length(files)
        load(fullfile(sprintf('~/proj/freedman_rep/data/%smat',append),files(fi).name));
        
        for di = 1:length(demoFields)
            cd = demoFields{di};
            
            if isfield(jglData.demographics,cd)
                comm = sprintf('%s{end+1} = jglData.demographics.%s',cd,cd);
                eval(comm);
            end
        end
        
        for di = 1:length(psFields)
            cd = psFields{di};
            
            if isfield(jglData.postSurvey,cd)
                comm = sprintf('%s{end+1} = jglData.postSurvey.%s',cd,cd);
                eval(comm);
            end
        end
    end
    
    for di = 1:length(demoFields)
            cd = demoFields{di};
        aname = sprintf('a%s',cd);
        comm = sprintf('%s{ai} = %s;',aname,cd);
        eval(comm);
    end
    for di = 1:length(psFields)
            cd = psFields{di};
        aname = sprintf('a%s',cd);
        comm = sprintf('%s{ai} = %s;',aname,cd);
        eval(comm);
    end
end

%% Age
dirage = [aage{1}{:}];
catage = [aage{2}{:}];
longage = [aage{3}{:}];
clage = [catage,longage];
disp(sprintf('In the directions task the mean age was %2.0f +- %2.1f years.',mean(dirage),std(dirage)));
disp(sprintf('In the category task the mean age was %2.0f +- %2.1f years.',mean(clage),std(clage)));

%% Gender
dirgen = cellfun(@(x) strcmp(x,'male'),agender{1});
catgen = cellfun(@(x) strcmp(x,'male'),agender{2});
longen = cellfun(@(x) strcmp(x,'male'),agender{3});
clgen = [catgen,longen];
disp(sprintf('In the directions task there were %i male and %i female participants',sum(dirgen),length(dirgen)-sum(dirgen)));
disp(sprintf('In the category task there were %i male and %i female participants',sum(clgen),length(clgen)-sum(clgen)));

%% ruleDir

% re-coding
recoded = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1];
disp(sprintf('In the directions task %2.0f%% of participants reported the correct rule after 75 trials.',sum(recoded)/length(recoded)*100));
%% ruleKnownDir

%% ruleCat

% re-coding
recoded150 = [0,1,0,0,0,0,0,0,-1,0,-1,-1,0,0,-1,0,-1,-1,-1,0,-1,0,0,0,0,0,0,0,-1,0,0,0,1,-1,0,-1,0,1,0,0,0,-1,1,0,-1,0,0];
recoded300 = [0,0,-1,-1,0,-1,-1,-1,0,0,-1,-1,0,-1,0,1];

disp(sprintf('Of the %i participants who did 150 trials %2.0f%% understood the rule, %2.0f%% were on the right track, and %2.0f%% had no idea or only knew that matching directions worked',length(recoded150),sum(recoded150==1)/length(recoded150)*100,sum(recoded150==-1)/length(recoded150)*100,sum(recoded150==0)/length(recoded150)*100));
disp(sprintf('Of the %i participants who did 300 trials %2.0f%% understood the rule, %2.0f%% were on the right track, and %2.0f%% had no idea or only knew that matching directions worked',length(recoded300),sum(recoded300==1)/length(recoded300)*100,sum(recoded300==-1)/length(recoded300)*100,sum(recoded300==0)/length(recoded300)*100));

%% Smoothness
dirsmo = [asmoothness{1}{:}];
catsmo = [asmoothness{2}{:}];
longsmo = [asmoothness{3}{:}];
clsmo = [catsmo,longsmo];
disp(sprintf('%i/%i direction participants reported a non-smooth display',sum(dirsmo<5),length(dirsmo)));
disp(sprintf('%i/%i category participants reported a non-smooth display',sum(clsmo<5),length(clsmo)));

%% attention

%% fixation
dirfix = cellfun(@(x) strcmp(x,'yes'),afixation{1});
catfix = cellfun(@(x) strcmp(x,'yes'),afixation{2});
lonfix = cellfun(@(x) strcmp(x,'yes'),afixation{3});
clfix = [catfix,lonfix];
disp(sprintf('%i/%i direction participants reported fixating the cross (this was not explicitly asked for)',sum(dirfix),length(dirfix)));
disp(sprintf('%i/%i category participants reported fixating the cross (this was not explicitly asked for)',sum(clfix),length(clfix)));

%% motion
dirmot = cellfun(@(x) strcmp(x,'yes'),amotion{1});
catmot = cellfun(@(x) strcmp(x,'yes'),amotion{2});
lonmot = cellfun(@(x) strcmp(x,'yes'),amotion{3});
clmot = [catmot,lonmot];
disp(sprintf('%i/%i direction participants reported eye jitter due to the motion stimulus',sum(dirmot),length(dirmot)));
disp(sprintf('%i/%i category participants reported eye jitter due to the motion stimulus',sum(clmot),length(clmot)));

%% before
dirbef = cellfun(@(x) strcmp(x,'yes'),abefore{1});
catbef = cellfun(@(x) strcmp(x,'yes'),abefore{2});
lonbef = cellfun(@(x) strcmp(x,'yes'),abefore{3});
clbef = [catbef,lonbef];
disp(sprintf('%i/%i direction participants reported having done a similar experiment',sum(dirbef),length(dirbef)));
disp(sprintf('%i/%i category participants reported having done a similar experiment',sum(clbef),length(clbef)));

%% comments