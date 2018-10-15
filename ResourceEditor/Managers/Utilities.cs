// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Utilities.cs" company="Alex">
//   free
// </copyright>
// <summary>
//   Defines the Utilities type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace ResourceEditor.Managers
{
    using System.Web;

    /// <summary>
    /// The utilities.
    /// </summary>
    public static class Utilities
    {
        /// <summary>
        /// The get ip address.
        /// </summary>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string GetIpAddress()
        {
            var context = HttpContext.Current;
            var ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipAddress))
            {
                string[] addresses = ipAddress.Split(',');
                if (addresses.Length != 0)
                {
                    return addresses[0];
                }
            }

            return context.Request.ServerVariables["REMOTE_ADDR"];
        }

        /// <summary>
        /// The get user ip.
        /// </summary>
        /// <param name="request">
        /// The request.
        /// </param>
        /// <returns>
        /// The <see cref="string"/>.
        /// </returns>
        public static string GetUserIp(HttpRequestBase request)
        {
            var ipList = request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            return !string.IsNullOrEmpty(ipList) ? ipList.Split(',')[0] : request.ServerVariables["REMOTE_ADDR"];
        }
    }
}