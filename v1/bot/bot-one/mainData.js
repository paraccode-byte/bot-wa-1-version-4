import view from 'my-function/other/view.js';
import member from 'my-function/group/member.js';
import polling from 'my-function/group/polling.js';
import hidetag from 'my-function/group/hidetsg.js';
import tagall from 'my-function/group/tagall.js';
import listadmin from 'my-function/group/listadmin.js';
import linkgc from 'my-function/group/linkgc.js';
import time from 'my-function/group/time.js';
import name_desc from 'my-function/group/name_desc.js';
import pp from 'my-function/group/pp.js';
import menuf from 'my-function/menu.js';
import list from 'my-function/_ms/listms.js';
import admin from 'my-function/admin.js';

const mainData = [
    { command: ".menu", function: menuf },
    { command: ".grup", function: list },
    { command: ".makepolling", function: polling },
    { command: ".view", function: view },
    { command: ".tagall", function: tagall },
    { command: ".hidetag", function: hidetag },
    { command: ".visibeltag", function: tagall },
    { command: ".member", function: member },
    { command: ".listadmin", function: listadmin },
    { command: ".linkgc", function: linkgc },
    { command: ".time", function: time },
    { command: ".ppgc", function: pp },
    { command: ".descgc", function: name_desc },
    { command: ".namegc", function: name_desc },

    { command: ".admin", function: list },
    { command: ".mute", function: admin },
    { command: ".setwelcome", function: admin },
    { command: ".setleave", function: admin },
    { command: ".nolinkall", function: admin },
    { command: ".nolinkgc", function: admin },
    { command: ".nolinkch", function: admin },
    { command: ".nolinktiktok", function: admin },
    { command: ".nolinkfb", function: admin },
    { command: ".nolinktwitter", function: admin },
    { command: ".nolinkig", function: admin },
    { command: ".nolinktg", function: admin },
    { command: ".nolinkdc", function: admin },
    { command: ".nolinkytvid", function: admin },
    { command: ".nolinkytch", function: admin },
    { command: ".nolinksosmed", function: admin },
    { command: ".notoxic", function: admin },
    { command: ".nospam", function: admin },
    { command: ".setppgroup", function: admin },
    { command: ".delppgroup", function: admin },
    { command: ".setnamegroup", function: admin },
    { command: ".setdescgrpup", function: admin },
    { command: ".editinfo", function: admin },
    { command: ".add", function: admin },
    { command: ".kick", function: admin },
    { command: ".createadmin", function: admin },
    { command: ".cabutadmin", function: admin },
]

export default mainData;