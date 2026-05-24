// =====================
// EMBED BOT (By ZenTheCosmic - UPGRADE)
// =====================
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =====================
// READY
// =====================
client.once("ready", () => {
  console.log(`[READY] Logged in as ${client.user.tag}`);
});

// =====================
// WELCOME
// =====================
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.get("1434403930653069430");
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#480FB4")
    .setTitle(`🎉 Welcome to ${member.guild.name}!`)
    .setDescription(
`🌟 Hello <@${member.id}> 👋

Thank you for joining Zeraya McLegacy 💜
Your adventure with us starts today ✨

We hope you'll enjoy the community,
make new friends, and create unforgettable moments here 🤝

📜 Be sure to check <#1485230100348797060>
💬 Feel free to introduce yourself in <#1434403931601113199>

Once again, welcome — and have an amazing time with us 💫`
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Member #${member.guild.memberCount}` })
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

// =====================
// LEAVE
// =====================
client.on("guildMemberRemove", (member) => {
  const channel = member.guild.channels.cache.get("1489566955290755203");
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#81058D")
    .setTitle(`🌙 Farewell from ${member.guild.name}`)
    .setDescription(
`<@${member.id}> has left the server.

Thanks for being part of our journey 💜
You'll always be welcome back anytime.`
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

// =====================
// BAN
// =====================
client.on("guildBanAdd", (ban) => {
  const channel = ban.guild.channels.cache.get("1489567134521753761");
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("🚫 User Banned")
    .setDescription(
`<@${ban.user.id}> has been permanently removed from **${ban.guild.name}**.`
    )
    .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

// =====================
// EMBED COMMAND
// =====================
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  if (!message.content.startsWith("!embed")) return;

  console.log(`[COMMAND] ${message.author.tag}: ${message.content}`);

  let content = message.content.slice(7).trim();

  // Detect mentioned user
  const mentionedUser = message.mentions.users.first() || message.author;

  const args = content.split("|").map(a => a.trim());

  let color = "#480FB4";
  let title, description;
  let showIcon = false;

  let authorName, authorIcon;
  let thumbnail, image;
  let footerText, footerIcon;

  // BASE
  if (args[0]?.startsWith("#")) {
    color = args[0];
    title = args[1];
    description = args[2];
  } else {
    title = args[0];
    description = args[1];
  }

  // Replace variables
  if (description) {
    description = description
      .replace(/{user\.mention}/g, `<@${mentionedUser.id}>`)
      .replace(
        /{user\.avatar}/g,
        mentionedUser.displayAvatarURL({ dynamic: true })
      );
  }

  // OPTIONS
  args.forEach(arg => {
    const lower = arg.toLowerCase();

    if (lower === "icon") showIcon = true;
    if (lower.startsWith("author:")) authorName = arg.slice(7).trim();
    if (lower.startsWith("authoricon:")) authorIcon = arg.slice(11).trim();
    if (lower.startsWith("thumbnail:")) thumbnail = arg.slice(10).trim();
    if (lower.startsWith("image:")) image = arg.slice(6).trim();
    if (lower.startsWith("footer:")) footerText = arg.slice(7).trim();
    if (lower.startsWith("footericon:")) footerIcon = arg.slice(11).trim();
  });

  if (!title || !description) {
    console.log("[ERROR] Invalid embed format");
    return message.reply("Use: !embed #color | Title | Description");
  }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description);

  // ICON
  if (showIcon) {
    embed.setThumbnail(
      message.author.displayAvatarURL({ dynamic: true })
    );
  }

  // AUTHOR
  if (authorName) {
    embed.setAuthor({
      name: authorName,
      iconURL: authorIcon || undefined
    });
  }

  // THUMBNAIL
  if (thumbnail) {
    if (thumbnail === "{user.avatar}") {
      embed.setThumbnail(
        mentionedUser.displayAvatarURL({ dynamic: true })
      );
    } else {
      embed.setThumbnail(thumbnail);
    }
  }

  // IMAGE
  if (image) embed.setImage(image);

  // FOOTER
  if (footerText) {
    embed.setFooter({
      text: footerText,
      iconURL: footerIcon || undefined
    });
  }

  try {
    await message.delete().catch(() => {
      console.log("[WARN] Failed to delete message");
    });

    await message.channel.send({ embeds: [embed] });

    console.log("[SUCCESS] Embed sent");
  } catch (err) {
    console.error("[CRASH]", err);
  }
});

// =====================
// LOGIN
// =====================
client.login(process.env.Zeraya);
