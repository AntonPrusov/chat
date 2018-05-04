var url = "http://students.a-level.com.ua:10012";
var myMessage = "";
var myNick = "";
var nextMessageId = 0;

drawMessages(nextMessageId);

setInterval(() => drawMessages(nextMessageId), 4000 );

btnSend.onclick = async function(e) {
	e.preventDefault();
	
	myNick = nick.value;
	myMessage = message.value;
	message.value = "";

	var newMessageId = await jsonPost(url, {func: 'addMessage', nick: myNick, message: myMessage});
	nextMessageId = newMessageId.nextMessageId;

	drawMessages(nextMessageId - 1);
}

async function drawMessages(id) 
	{
		var data = await jsonPost(url, {func: "getMessages", messageId: id});
		var array = data.data;		
		
		if(array.length !== 0) {	
			array.forEach(message => {
	            let messageTime = new Date(message.timestamp);
	            let messageNick = message.nick;
	            let messageMessage = message.message;
	            let messageLi = document.createElement('li');
	            let messageInfo = document.createElement('p');
	            let messageTimeSpan = document.createElement('span');
	            let messageText = document.createElement('p');

	            messageLi.className  = "list-group-item";
	            messageInfo.className  = "messageInfo";
	            messageInfo.innerHTML = messageNick + "  ";
	            messageTimeSpan.innerHTML = messageTime;
	            messageText.className  = "messageText";
	            messageText.innerHTML = '" ' + messageMessage + ' "';

	            chat.prepend(messageLi);
	            messageLi.appendChild(messageInfo);
	            messageInfo.appendChild(messageTimeSpan);
	            messageLi.appendChild(messageText);
	        });
	        nextMessageId = data.nextMessageId;
        }		
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