function info = getAllInfo()%% getAllInfo

global analysis

files = dir(fullfile(analysis.dir,'mat/*.mat'));

info = {};
for fi = 1:length(files)
    info{fi} = getInfo(files(fi).name);
    
end