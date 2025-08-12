using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Application.Services
{
    public class NotificationService
    {
        private readonly ISendNotification _notificationSender;
        public NotificationService(ISendNotification notificationSender)
        {
            _notificationSender = notificationSender;
        }
        public async Task<bool> NotifyUser(string email, string notificationMessage)
        {
            string body = "Smartchef: Find your inspiration everyday on this amazing cooking app!\n\n";
            body += notificationMessage;
            body += "\n\n\tThank you, \n Smartchef Team!";
            return await _notificationSender.SendNotificationTo(email, body);
        }
    }
}
