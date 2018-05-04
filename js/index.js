var url = "http://students.a-level.com.ua:10012";
var myMessage = "";
var myNick = "";
var nextMessageId = 0;

drawMessages(nextMessageId);

/*setInterval(() => drawMessages(nextMessageId), 2500 );*/

btnSend.onclick = async function(e) {
	e.preventDefault();
	
	myNick = nick.value;
	myMessage = message.value;

	var newMessageId = await jsonPost(url, {func: 'addMessage', nick: myNick, message: myMessage});
	nextMessageId = newMessageId.nextMessageId;

	/*drawMessages(nextMessageId);*/
}



async function drawMessages(id) 
	{
		var data = await jsonPost(url, {func: "getMessages", messageId: id});
		var array = data.data;
		
		for (var i = array.length - 1; i >= nextMessageId; i--) {
			let messageTime = new Date(array[i].timestamp);
			let messageNick = array[i].nick;
			let messageMessage = array[i].message;
			let messageLi = document.createElement('li');
			let messageInfo = document.createElement('p');
			let messageTimeSpan = document.createElement('span');
			let messageText = document.createElement('p');

			messageLi.className  = "list-group-item";
			messageInfo.className  = "messageInfo";
			messageInfo.innerHTML = messageNick + "  ";
			messageTimeSpan.innerHTML = messageTime;
			messageText.className  = "messageText";
			messageText.innerHTML = '"' + messageMessage + '"';

			chat.appendChild(messageLi);
			messageLi.appendChild(messageInfo);
			messageInfo.appendChild(messageTimeSpan);
			messageLi.appendChild(messageText);
		}

		nextMessageId = data.nextMessageId;
	}

function jsonPost(url, data)
    {
        return new Promise((resolve, reject) => {
            var x = new XMLHttpRequest();   
            x.onerror = () => reject(new Error('jsonPost failed'))
            //x.setRequestHeader('Content-Type', 'application/json');
            x.open("POST", url, true);
            x.send(JSON.stringify(data))

            x.onreadystatechange = () => {
                if (x.readyState == XMLHttpRequest.DONE && x.status == 200){
                    resolve(JSON.parse(x.responseText))
                }
                else if (x.status != 200){
                    reject(new Error('status is not 200'))
                }
            }
        })
    }