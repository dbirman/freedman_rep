%% First, copy all /mat and /csv directories to a local backup

% done by hand

%% Now, go through the csv directories and replace the names with numbers

count = 0;

top = '~/proj/freedman_rep/data/dircsv/';

files = dir(fullfile(top,'*csv'));

for fi = 1:length(files)
    copyfile(fullfile(top,files(fi).name),fullfile(top,sprintf('%i.csv',count)));
    count = count + 1;
end
top = '~/proj/freedman_rep/data/catcsv/';

files = dir(fullfile(top,'*csv'));

for fi = 1:length(files)
    copyfile(fullfile(top,files(fi).name),fullfile(top,sprintf('%i.csv',count)));
    count = count + 1;
end
top = '~/proj/freedman_rep/data/longcsv/';

files = dir(fullfile(top,'*csv'));

for fi = 1:length(files)
    copyfile(fullfile(top,files(fi).name),fullfile(top,sprintf('%i.csv',count)));
    count = count + 1;
end

%% Now, go through the mat directories, load the files, strip the WID and replace with count

count = 0;

top = '~/proj/freedman_rep/data/dirmat/';

files = dir(fullfile(top,'*mat'));

for fi = 1:length(files)
    load(fullfile(top,files(fi).name));
    myscreen.uniqueId = count;
    myscreen.workerID = count;
    myscreen.assignmentID = 'REMOVED';
    
    save(fullfile(top,sprintf('%i.mat',count)),'myscreen','jglData','stimulus');
    delete(fullfile(top,files(fi).name));

    count = count + 1;
end

%% others

top = '~/proj/freedman_rep/data/catmat/';

files = dir(fullfile(top,'*mat'));

for fi = 1:length(files)
    load(fullfile(top,files(fi).name));
    myscreen.uniqueId = count;
    myscreen.workerID = count;
    myscreen.assignmentID = 'REMOVED';
    
    save(fullfile(top,sprintf('%i.mat',count)),'myscreen','jglData','stimulus');
    delete(fullfile(top,files(fi).name));

    count = count + 1;
end

top = '~/proj/freedman_rep/data/longmat/';

files = dir(fullfile(top,'*mat'));

for fi = 1:length(files)
    load(fullfile(top,files(fi).name));
    myscreen.uniqueId = count;
    myscreen.workerID = count;
    myscreen.assignmentID = 'REMOVED';
    
    save(fullfile(top,sprintf('%i.mat',count)),'myscreen','jglData','stimulus');
    delete(fullfile(top,files(fi).name));

    count = count + 1;
end
