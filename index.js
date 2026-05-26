// =====================
// 𝙴𝙼𝙱𝙴𝙳 𝙱𝙾𝚃 (𝙱𝚢 𝚉𝚎𝚗𝚃𝚑𝚎𝙲𝚘𝚜𝚖𝚒𝚌 - 𝚄𝙿𝙶𝚁𝙰𝙳𝙴)
// =====================
const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =====================
// 𝚁𝙴𝙰𝙳𝚈
// =====================
client.once("ready", () => {
  console.log(`[READY] Logged in as ${client.user.tag}`);
});

// =====================
// 𝚆𝙴𝙻𝙲𝙾𝙼𝙴
// =====================
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.get("1434403930653069430");
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("#ff00e9")
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
// 𝙻𝙴𝙰𝚅𝙴
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
// 𝙱𝙰𝙽
// =====================
client.on("guildBanAdd", async (ban) => {
  const channel = ban.guild.channels.cache.get("1489567134521753761");
  if (!channel) return;

  try {
    const fetchedLogs = await ban.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanAdd
    });

    const banLog = fetchedLogs.entries.first();

    let moderator = "Unknown";
    let reason = "No reason provided";

    if (banLog) {
      moderator = `<@${banLog.executor.id}>`;
      reason = banLog.reason || "No reason provided";
    }

    const embed = new EmbedBuilder()
      .setColor("#FF00e9")
      .setTitle("🚫 User Banned")
      .setDescription(
`<@${ban.user.id}> has been permanently removed from **${ban.guild.name}**.

👮 Moderator: ${moderator}
📝 Reason: ${reason}`
      )
      .setThumbnail(
        ban.user.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp();

    channel.send({ embeds: [embed] });

  } catch (err) {
    console.error("[BAN LOG ERROR]", err);
  }
});

// =====================
// 𝙴𝙼𝙱𝙴𝙳 𝙲𝙾𝙼𝙼𝙰𝙽𝙳
// =====================
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  if (!message.content.startsWith("!embed")) return;

  console.log(`[COMMAND] ${message.author.tag}: ${message.content}`);

  let content = message.content.slice(7).trim();

  // 𝙳𝚎𝚝𝚎𝚌𝚝 𝚖𝚎𝚗𝚝𝚒𝚘𝚗𝚎𝚍 𝚞𝚜𝚎𝚛
  const mentionedUser = message.mentions.users.first() || message.author;

  const args = content.split("|").map(a => a.trim());

  let color = "#480FB4";
  let title, description;
  let showIcon = false;

  let authorName, authorIcon;
  let thumbnail, image;
  let footerText, footerIcon;

  // 𝙱𝙰𝚂𝙴
  if (args[0]?.startsWith("#")) {
    color = args[0];
    title = args[1];
    description = args[2];
  } else {
    title = args[0];
    description = args[1];
  }

  // 𝚁𝚎𝚙𝚕𝚊𝚌𝚎 𝚟𝚊𝚛𝚒𝚊𝚋𝚕𝚎𝚜
  if (description) {
    description = description
      .replace(/{user\.mention}/g, `<@${mentionedUser.id}>`)
      .replace(
        /{user\.avatar}/g,
        mentionedUser.displayAvatarURL({ dynamic: true })
      );
  }

  // 𝙾𝙿𝚃𝙸𝙾𝙽𝚂
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

  // 𝙸𝙲𝙾𝙽
  if (showIcon) {
    embed.setThumbnail(
      message.author.displayAvatarURL({ dynamic: true })
    );
  }

  // 𝙰𝚄𝚃𝙷𝙾𝚁
  if (authorName) {
    embed.setAuthor({
      name: authorName,
      iconURL: authorIcon || undefined
    });
  }

  // 𝚃𝙷𝚄𝙼𝙱𝙽𝙰𝙸𝙻
  if (thumbnail) {
    if (thumbnail === "{user.avatar}") {
      embed.setThumbnail(
        mentionedUser.displayAvatarURL({ dynamic: true })
      );
    } else {
      embed.setThumbnail(thumbnail);
    }
  }

  // 𝙸𝙼𝙰𝙶𝙴
  if (image) embed.setImage(image);

  // 𝙵𝙾𝙾𝚃𝙴𝚁
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
// 𝙻𝙾𝙶𝙸𝙽
// =====================
client.login(process.env.Zeraya);
