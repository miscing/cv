# Cv

A personal cv generator. Generates a cv based on github repository topics, so your cv will always reflect your current code.

## Cool features:
 - Select the parts you want to keep, then print as PDF. Keep all your CV versions in one place, customize for each job application.
 - Make CV include all your newest github repositories.
 - Use YAML to easily configure, or generate a JSON using GUI.

## To use:
1. Fork or otherwise copy this repository. (you may want to delete/rename/empty `cv.json` and `cv.yml`
2. Configure with one of the two methods:
   1. Use GUI in website and copy generated JSON to `cv.json`.
   2. Configure using YAML in cv.yml file, then run pipeline.

## Example:
Here is my own CV, be nice (But feedback is highly encouraged, whether about content or underlying code)!
[Always looking for a good job :)](https://miscing.github.io/cv/)

## Yaml syntax

### Top level:
Top level items are used to construct the profile. On top of the reserved keywords in the table below, all the following sections have their own keyword, keyword are same as section title (`- about`).

| Keyword    | Input syntax              | Explanation                                                                                                       |
|------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| name       | Firstname Surname         | Name to display, only accepts two words. Required.                                                                |
| gitlab     | username                  | Gitlab username                                                                                                   |
| github     | username                  | Github username                                                                                                   |
| matrix     | username                  | Matrix username                                                                                                   |

#### About:
An array of strings allowing one to put multiple 'about me' texts as well as defining some basic information with keywords. You can place the text on the same line if you only have one item.
```yaml
about:
  - "This is a elaborate and embellished explanation of who I am and what I have done."
  - "This is a modified version of the above meant for a different job."
```

| Keyword    | Input syntax              | Explanation                                                                                                       |
|------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| language   | a language number pair    | Name of language spoken and proficiency in a scale of 1-5.                                                        |
| custom     | string                    | A string containing a free form text describing you, all items that are strings will be interpreted as this.      |


#### Skills:
Default behavior is to create the skill with links to all github repositories that contain the skill name as a github "Topic". If the skill has children, they are assumed to be topic names to match with (multiple topics to match with can be assigned like this, skill name is ignored in this case), with the exception of reserved keywords below.
```yaml
skills:
  - c:
    - file:
      - filename
```

| Keyword    | Input syntax              | Explanation                                                                                                       |
|------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| text       | long string escape with ""| A short explanation of skill.                                                                                     |
| file       | file name to use, see ->  | On top of showing links to matching topics, will also have direct links to files with provided filename.          |
| rfile      | file name to use, regex   | Same as file, except string is interpreted as regex. Notice "." in regex is a special character.                  |
| url        | list of valid url         | This urls will be show in addition (or alone) to repositories, in the same way                                    |
| level      | number 1-5, 5 is best     | Meant to be a general indication of proficiency in the given skill.                                               |
| custom     | string, skill name        | Name of topic or topics to match with, overrides matching with parent skill name.                                 |

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.7.
