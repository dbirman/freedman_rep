function makeAllMats() 
    files = dir('./xmls/*.xml');
    for file=files'
        disp(file.name);
        generateMat(file.name);
    end
end