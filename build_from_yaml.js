"use strict";
//
// Copyright 2020 Alexander Saastamoinen
//
//  Licensed under the EUPL, Version 1.2 or – as soon they
// will be approved by the European Commission - subsequent
// versions of the EUPL (the "Licence");
//  You may not use this work except in compliance with the
// Licence.
//  You may obtain a copy of the Licence at:
//
//  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
//
//  Unless required by applicable law or agreed to in
// writing, software distributed under the Licence is
// distributed on an "AS IS" basis,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied.
//  See the Licence for the specific language governing
// permissions and limitations under the Licence.
//
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var yaml_1 = require("yaml");
var fs_1 = require("fs");
var cv_1 = require("./src/app/cv");
var file_type_1 = require("file-type");
function generateCv(file) {
    return new Promise(function (resolve, reject) {
        fs_1.readFile(file, 'utf8', function (err, data) {
            if (err !== null) {
                return reject(err);
            }
            var cv = new cv_1.Cv; // new cv for yaml data
            console.log(data); // print so input is visible in cicd logs
            var parsed;
            try {
                parsed = yaml_1.parse(data);
            }
            catch (e) {
                return reject(e);
            }
            // generate skills
            var skills = generateSkills(parsed.skills);
            // generate about
            var about = generateAbout(parsed.about);
            // generate timeline
            var timeline = generateTimeline(parsed.timeline);
            // generate profile
            var prof = generateProfile(parsed);
            // collect results
            Promise.all([skills, prof, about, timeline]).then(function (resArr) {
                cv.skills = resArr[0];
                cv.profile = resArr[1];
                cv.about = resArr[2];
                cv.timeline = resArr[3];
                return resolve(cv);
            })["catch"](function (e) { return reject(e); });
        });
    });
}
function generateTimeline(timeline) {
    return new Promise(function (resolve, reject) {
        var result = [];
        timeline.forEach(function (obj) {
            var moment = parseDate(Object.getOwnPropertyNames(obj)[0]);
            moment.desc = obj[Object.getOwnPropertyNames(obj)[0]];
            result.push(moment);
        });
        resolve(result);
    });
}
function parseDate(date) {
    var dates = date.split('-');
    if (dates.length != 2) {
        throw "timeline dates must consist of two '-' seperated dates, a start and end";
    }
    var moment = new cv_1.Moment;
    dates.forEach(function (d, i) {
        var dest;
        if (i === 0) {
            dest = "dateStart";
        }
        else {
            dest = "dateEnd";
        }
        var dFields = d.split('/');
        switch (dFields.length) {
            case 2:
                moment[dest] = new cv_1.SimpleDate(Number(dFields[0]), Number(dFields[1]));
                break;
            case 3:
                // ignores day
                console.log("CV only allows month/year dates, ignoring day in " + date);
                moment[dest] = new cv_1.SimpleDate(Number(dFields[1]), Number(dFields[2]));
                break;
            default:
                throw new SyntaxError("incorrect syntax in date: " + date);
        }
    });
    return moment;
}
function generateAbout(parsedAbout) {
    return new Promise(function (resolve, reject) {
        var about = new cv_1.About;
        if (Array.isArray(parsedAbout)) {
            parsedAbout.forEach(function (field) {
                if (typeof field === "string") {
                    // strings must be texts
                    about.text.push(field);
                }
                else if (typeof field === "object") {
                    switch (Object.getOwnPropertyNames(field)[0]) {
                        case "languages":
                            if (!about.hasOwnProperty("languages")) {
                                about.langs = [];
                            }
                            field.languages.forEach(function (yamlLang) {
                                var languageName = Object.getOwnPropertyNames(yamlLang);
                                if (languageName.length === 0) {
                                    throw "language contains more than one field, invalid syntax.";
                                }
                                about.langs.push(new cv_1.Lang(languageName[0], yamlLang[languageName[0]]));
                            });
                            break;
                        default:
                            if (!about.hasOwnProperty("custom")) {
                                about.custom = [];
                            }
                            var extra = new cv_1.AboutExtra(Object.getOwnPropertyNames(field)[0], field[Object.getOwnPropertyNames(field)[0]]);
                            about.custom.push(extra);
                            break;
                    }
                }
            });
        }
        else if ((typeof parsedAbout) === "string") {
            // only contains a single main text
            about.text.push(parsedAbout);
        }
        else {
            throw "syntax error in about, must contain an array or string";
        }
        resolve(about);
    });
}
function generateProfile(parsed) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var picPromise, cv_2, pic_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    picPromise = getProfilePic();
                    cv_2 = genProfile(parsed);
                    return [4 /*yield*/, picPromise];
                case 1:
                    pic_1 = _a.sent();
                    fs_1.copyFile(pic_1, "./src/assets/" + pic_1, function (e) {
                        if (e != null) {
                            return reject(e);
                        }
                        else {
                            cv_2.pic = "assets/" + pic_1;
                            return resolve(cv_2);
                        }
                    });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, reject(e_1)];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
function getProfilePic() {
    return new Promise(function (resolve, reject) {
        // add profile pic to assets and link name. sets empty path if no valid image found
        fs_1.readdir(".", { withFileTypes: true }, function (err, files) {
            if (err != null) {
                reject(err);
            }
            var promises = [];
            var fileNames = [];
            var profileName = /profile\.\w*/;
            files.forEach(function (file) {
                if (file.isFile()) {
                    if (file.name.match(profileName)) {
                        promises.push(file_type_1.fromFile(file.name));
                        fileNames.push(file.name);
                    }
                }
            });
            Promise.all(promises).then(function (filetypes) {
                var imageMime = /image\/\w*/;
                var i = filetypes.findIndex(function (ft) { return ft.mime.match(imageMime); });
                resolve(fileNames[i]);
            })["catch"](function (e) { reject(e); });
        });
    });
}
function genProfile(parsed) {
    var profile = new cv_1.Profile;
    Object.getOwnPropertyNames(parsed).forEach(function (field) {
        switch (field) {
            case "name":
                var words = parsed[field].split(' ');
                if (words.length != 2) {
                    throw "name must be in format 'firstname surname'";
                }
                profile.firstname = words[0];
                profile.surname = words[1];
                break;
            case "github":
                var githublink = new cv_1.Link;
                githublink.name = "github";
                githublink.url = "https://github.com/" + parsed[field];
                githublink.username = parsed[field];
                profile.links.push(githublink);
                break;
            case "gitlab":
                var gitlablink = new cv_1.Link;
                gitlablink.name = "gitlab";
                gitlablink.url = "https://gitlab.com/" + parsed[field];
                gitlablink.username = parsed[field];
                profile.links.push(gitlablink);
                break;
            case "matrix":
                var matrixlink = new cv_1.Link;
                matrixlink.name = "matrix";
                matrixlink.url = "https://app.element.io/";
                matrixlink.text = parsed[field];
                profile.links.push(matrixlink);
                break;
            default:
                break;
        }
    });
    return profile;
}
function generateSkills(yamlSkills) {
    return new Promise(function (resolve, reject) {
        if (yamlSkills.length != 0) {
            try {
                return resolve(genSkills(yamlSkills));
            }
            catch (e) {
                return reject(e);
            }
        }
    });
}
// generates js skills from yaml skills
function genSkills(yamlSkills) {
    var skills = [];
    yamlSkills.forEach(function (v) {
        var skill = new cv_1.Skill;
        if (typeof v === "object") {
            skill = genSkill(v);
        }
        else if (typeof v === "string") {
            // if string assumed to be a skill which matches to same name topics
            skill.name = v;
        }
        else {
            throw "unsupported field in " + v;
        }
        skills.push(skill);
    });
    return skills;
}
// generates a js skill from a yaml skill definitions with options, simple one line skills are generated by parent function genSkills
function genSkill(item) {
    var skill = new cv_1.Skill;
    var fields = Object.getOwnPropertyNames(item);
    if (fields.length != 1) {
        throw "skill with more than one (or 0) names, should not be possible";
    }
    skill.name = fields[0];
    var skillOpt = new cv_1.SkillOption;
    item[fields[0]].forEach(function (option) {
        if (typeof option === "object") {
            // if child is an object, it must be a reserved keyword
            Object.getOwnPropertyNames(option).forEach(function (optName) {
                var _a;
                switch (optName) {
                    case "text":
                        skill.text = option[optName];
                        break;
                    case 'file':
                        skillOpt.file = option[optName];
                        break;
                    case 'rfile':
                        skillOpt.rfile = option[optName];
                        break;
                    case 'url':
                        if (!skill.links) {
                            skill.links = [];
                        }
                        (_a = skill.links).push.apply(_a, option[optName]);
                        break;
                    case "level":
                        skill.level = option[optName];
                        break;
                    default:
                        throw "invalid option name " + optName;
                }
            });
        }
        else if (typeof option === "string") {
            // if child is a string, assumed to be a topic. Multiple topics to match with are allowed.
            if (!skillOpt.hasOwnProperty("topics")) {
                skillOpt.topics = [];
            }
            skillOpt.topics.push(option);
        }
        else {
            // we should not get here
            throw "invalid yaml for cv";
        }
        if (Object.getOwnPropertyNames(skillOpt).length !== 0) {
            skill.options = skillOpt;
        }
    });
    return skill;
}
function main() {
    generateCv("cv.yml").then(function (cv) {
        // write payload to file
        var payload = JSON.stringify(cv);
        fs_1.writeFile("cv.json", payload, 'utf-8', function (err) {
            if (err !== null) {
                throw "error writing file, error: " + err;
            }
            else {
                console.log("succesfully parsed yaml and generated json cv");
            }
        });
    })["catch"](function (e) {
        console.error("ERROR:");
        if (e.name === "YAMLSyntaxError") {
            console.error(e.message);
        }
        else {
            console.error(e);
        }
    });
}
if (require.main === module) {
    main();
}
