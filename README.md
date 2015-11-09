# freedman_rep

Please see http://gru.stanford.edu/doku.php/categorization

### Structure

**Analysis**:
Data analysis scripts in MATLAB and R. Output figures.

**Data**: 
Files are stored in dir*, cat*, and long* based on which experiment they came from. Raw data has the fields:
keys: keypresses
responses: 1 = space, -1 = nothing
correct: 1 = correct
direction: which category was used 1/2
categories: whether this is a category task trial = 1
postSurvey: responses to the survey questions
match: 1 = match trial
rot1: first stimulus rotation
rot2: second stimulus rotation
known: whether participant is informed (1/0)
trial: trial # within block
block: block # within task
corrLimit: how many times participant has seen all 64 directions in the category task
dirC: how many times the participant got this direction correct (64 space -> rot1,rot2 indexes function in task.js)
dirN: number of times they have seen this direction
demographics: demographic questions

**Templates**:
HTML files for experiment script

**Static**:
Images and JS files for experiment script.

**Launching**

You will need psiturk installed, see http://psiturk.org/
To launch the experiment run the following commands (MAC OS X):

```
cd ~
git clone httpL//github.com/dbirman/freedman_rep
cd freedman_rep
psiturk
server on
debug
```

By default it launches the categorization task. Change taskDir = 1 in task.js to get the directions task.
psiturk
