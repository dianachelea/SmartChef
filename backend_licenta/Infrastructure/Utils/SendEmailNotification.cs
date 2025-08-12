using Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Utils
{
    public class SendEmailNotification : ISendNotification
    {
        public Task<bool> SendNotificationTo(string email, string body)
        {
            var fromAddress = new MailAddress("dianachelea1@gmail.com", "Smartchef");
            var toAddress = new MailAddress(email, "User");
            const string fromPassword = "gmhb lahk kuvb kcli";
            const string subject = "Smartchef Notification";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                smtp.Send(message);
            }

            return Task.FromResult(true);
        }
    }
}